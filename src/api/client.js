const API_DELAY = 600

export const mockHttpClient = async (callback) => {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY))
  return callback()
}

