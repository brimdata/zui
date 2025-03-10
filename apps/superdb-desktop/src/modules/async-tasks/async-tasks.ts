import {AsyncTask} from "./async-task"

export class AsyncTasks {
  tasks: AsyncTask[] = []

  create(tags: string[]): AsyncTask {
    const task = new AsyncTask(tags, () => this.remove(task))
    this.tasks.push(task)
    return task
  }

  remove(task: AsyncTask) {
    const index = this.tasks.indexOf(task)
    if (index >= 0) this.tasks.splice(index, 1)
  }

  createOrReplace(tags: string[]) {
    this.abort(tags)
    return Promise.resolve(this.create(tags))
  }

  abort(tags: string[]) {
    for (const task of this.where(tags)) task.abort()
  }

  abortAll() {
    for (const task of this.tasks) task.abort()
  }

  private where(tags: string[]) {
    return this.tasks.filter((task) => task.containsAll(tags))
  }
}
