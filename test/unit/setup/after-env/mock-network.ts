import server from "../../helpers/server"

beforeAll(() => server.listen({onUnhandledRequest: "error"}))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
