/* @flow

TRANSACTION
This function accepts an array of "steps". A step is an object with two
function properties called "do" (required) and "undo" (optional).

Example:
const step = {
  do: () => "hello world",
  undo: () => "goodbye world"
}

RETURN VALUES
The transaction loops through each step and calls "do". If "do" returns a value,
it is passed as the argument of the next "do" function. If it returns undefined,
the same arg is passed through to the next "do".

ERRORS
IF "do" throws an error, it is caught and saved, and the loop stops. All the
previously completed steps are looped through in reverse calling their "undo"
function. If any of the "undo" steps throw an error, they are caught and saved.
Once all steps have been undone, an TransactionError is thrown with all the
errors it collected.
*/

type Step = {do: Function, undo?: Function}
export default async function(steps: Step[]) {
  let ctx
  let undoErrs = []

  for (let d = 0; d < steps.length; d++) {
    try {
      let ret = await steps[d].do(ctx)
      ctx = ret === undefined ? ctx : ret
    } catch (doErr) {
      for (let u = d - 1; u >= 0; u--) {
        let {undo} = steps[u]
        if (!undo) continue
        try {
          await undo(ctx)
        } catch (undoErr) {
          undoErrs.push(new UndoError(undoErr, u + 1))
        }
      }
      throw new TransactionError(doErr, d + 1, steps, undoErrs)
    }
  }
  return ctx
}

class UndoError extends Error {
  cause: Error
  step: number
  constructor(cause, step) {
    super(`Undo ${step} Failed: ${cause.message}`)
    this.step = step
    this.stack = cause.stack
  }
}

class TransactionError extends Error {
  cause: Error
  undoErrors: UndoError[]

  constructor(cause, step, steps, undoErrs) {
    super(
      `${failMessage(step, steps)} (${undoMsg(undoErrs)})\nCause: ${
        cause.message
      }`
    )
    this.cause = cause
    this.stack = cause.stack
    this.undoErrors = undoErrs
  }
}

function failMessage(step, steps) {
  return `Transaction failed at step ${step} of ${steps.length}`
}

function undoMsg(errs: UndoError[]) {
  if (errs.length === 0) return "Undos succeeded"
  return `Undos failed at step ${errs.map((e) => e.step).join(", ")}`
}
