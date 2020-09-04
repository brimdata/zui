
import brim from "./";

const sampleConfig = () => ({
  username: {
    label: "Username",
    name: "username",
    defaultValue: "joe",
    check: jest.fn(() => [true, "no error"]),
    submit: jest.fn()
  }
});

const sampleFormElement = (): HTMLFormElement => {
  let elements = {
    username: {
      value: "joeshmoe"
    }
  };
  // $FlowFixMe
  return {
    elements: {
      namedItem: name => elements[name]
    }
  };
};

test("isValid when true", async () => {
  // $FlowFixMe
  let form = brim.form(sampleFormElement(), sampleConfig());
  expect((await form.isValid())).toBe(true);
});

test("isValid when false", async () => {
  let failure = jest.fn(value => [value === "ME", "Value is not ME"]);
  let config = sampleConfig();
  config.username.check = failure;

  let form = brim.form(sampleFormElement(), config);

  expect((await form.isValid())).toBe(false);
  expect(form.getErrors()).toEqual([{
    input: { value: "joeshmoe" },
    label: "Username",
    message: "Value is not ME"
  }]);
});

test("submit", () => {
  let config = sampleConfig();
  let form = brim.form(sampleFormElement(), config);

  form.submit();

  expect(config.username.submit).toHaveBeenCalledWith("joeshmoe");
});

test("a missing field", () => {
  let config = sampleConfig();
  config.username.name = "missing";
  let form = brim.form(sampleFormElement(), config);

  return expect(form.isValid()).rejects.toEqual(new Error(`No input with name="missing"`));
});

test("when check returns undefined", () => {
  let config = sampleConfig();
  config.username.check = () => {};
  let form = brim.form(sampleFormElement(), config);

  return expect(form.isValid()).rejects.toEqual(new Error(`username check did not return an array`));
});