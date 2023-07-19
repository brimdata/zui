package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"strings"
	"syscall/js"

	"github.com/brimdata/zed"
	"github.com/brimdata/zed/compiler"
	"github.com/brimdata/zed/pkg/storage"
	"github.com/brimdata/zed/runtime"
	"github.com/brimdata/zed/zbuf"
	"github.com/brimdata/zed/zio"
	"github.com/brimdata/zed/zio/anyio"
	"github.com/teamortix/golang-wasm/wasm"
	"golang.org/x/exp/slices"
)

func main() {
	wasm.Expose("zq", zq)
	wasm.Ready()
	<-make(chan struct{})
}

type opts struct {
	Program      string   `wasm:"program"`
	Input        js.Value `wasm:"input"`
	InputFormat  string   `wasm:"inputFormat"`
	OutputFormat string   `wasm:"outputFormat"`
}

// chunk represents a chunk in a ReadableStream
type chunk struct {
	Done  bool     `wasm:"done"`
	Value js.Value `wasm:"value"`
}

var errInvalidInput = errors.New("only string or ReadableStream accept as input")

func zq(opts opts) wasm.Promise {
	return wasm.NewPromise(func() (interface{}, error) {
		flowgraph, err := compiler.Parse(opts.Program)
		if err != nil {
			return "", err
		}
		var r io.Reader
		switch typ := opts.Input.Type(); typ {
		case js.TypeString:
			r = strings.NewReader(opts.Input.String())
		case js.TypeObject:
			if !opts.Input.InstanceOf(js.Global().Get("ReadableStream")) {
				return nil, errInvalidInput
			}
			r = readableStream(opts.Input)
		default:
			return "", errInvalidInput
		}
		zctx := zed.NewContext()
		zr, err := anyio.NewReaderWithOpts(zctx, r, anyio.ReaderOpts{
			Format: opts.InputFormat,
		})
		if err != nil {
			return "", err
		}
		defer zr.Close()
		var buf bytes.Buffer
		zwc, err := anyio.NewWriter(zio.NopCloser(&buf), anyio.WriterOpts{Format: opts.OutputFormat})
		if err != nil {
			return "", err
		}
		defer zwc.Close()
		local := storage.NewLocalEngine()
		comp := compiler.NewFileSystemCompiler(local)
		query, err := runtime.CompileQuery(context.Background(), zctx, comp, flowgraph, []zio.Reader{zr})
		if err != nil {
			return "", err
		}
		defer query.Pull(true)
		if err := zbuf.CopyPuller(zwc, query); err != nil {
			return "", err
		}
		if err := zwc.Close(); err != nil {
			return "", err
		}
		return buf.String(), nil
	})
}

func readableStream(readable js.Value) io.Reader {
	pr, pw := io.Pipe()
	go func() {
		reader := readable.Call("getReader")
		var buf []byte
		for {
			var ch chunk
			if err := await(reader.Call("read"), &ch); ch.Done || err != nil {
				pw.CloseWithError(err)
				return
			}
			n := ch.Value.Length()
			buf = slices.Grow(buf, n)
			b := buf[:n]
			js.CopyBytesToGo(b, ch.Value)
			pw.Write(b)
		}
	}()
	return pr
}

func await(prom js.Value, v interface{}) error {
	err := make(chan error)
	prom.Call("then", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) > 0 && v != nil {
			err <- wasm.FromJSValue(args[0], v)
			return nil
		}
		err <- nil
		return nil
	}))
	prom.Call("catch", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		err <- errors.New(args[0].Call("toString").String())
		return nil
	}))
	return <-err
}
