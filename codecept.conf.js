exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  
  helpers: {
    REST: {
      endpoint: 'http://localhost',
      defaultHeaders: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    },

    JSONResponse: {}
  },

  include: {
    I: './steps_file.js'
  },

  plugins: {
    htmlReporter: {
      enabled: true
    },

    retryFailedStep: {
      enabled: true,
      retries: 2
    }
  },

  name: 'Second-hand-EV-Battery-Trading-Platform'
};