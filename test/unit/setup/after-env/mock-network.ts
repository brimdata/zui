import server from "../../helpers/server"

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
