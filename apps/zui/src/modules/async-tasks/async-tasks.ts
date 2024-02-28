import {AsyncTask} from "./async-task"

export class AsyncTasks {
  tasks: AsyncTask[] = []

  create(tags: string[]) {
    const task = new AsyncTask(tags)
    this.tasks.push(task)
    return task
  }

  createOrReplace(tags: string[]) {
    for (const task of this.where(tags)) {
      task.abort()
      this.remove(task)
    }
    return this.create(tags)
  }

  abort(tags: string[]) {
    for (const task of this.where(tags)) {
      task.abort()
      this.remove(task)
    }
  }

  abortAll() {
    for (const task of this.tasks) task.abort()
    this.tasks = []
  }

  private where(tags: string[]) {
    return this.tasks.filter((task) => task.containsAll(tags))
  }

  private remove(task: AsyncTask) {
    return this.tasks.splice(this.tasks.indexOf(task), 1)
  }
}
