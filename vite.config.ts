import { defineConfig } from 'vite'

// Allows using jsconfig ~ paths in the website
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
