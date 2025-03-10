import styled from "styled-components"

export const Data = styled.dl`
  font-family: var(--mono-font);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
  cursor: default;
  line-height: 1.7;
`

export const Name = styled.dt`
  margin: 0;
  white-space: nowrap;
`

export const Value = styled.dd`
  flex: 1;
  text-align: right;
  margin: 0 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: all;

  &.addr,
  &.set\[addr\] {
    color: var(--ip);
  }

  &.port,
  &.set\[port\] {
    color: var(--port);
  }

  &.interval,
  &.set\[interval\] {
    color: var(--interval);
  }

  &.count,
  &.set\[count\] {
    color: var(--count);
  }

  &.bool,
  &.set\[bool\] {
    color: var(--blue);
  }
`
