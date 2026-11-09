import {defineConfig} from '@playwright/test';
const baseURL=process.env.TOOLBOX_BASE_URL??'http://127.0.0.1:5178';
export default defineConfig({testDir:'./tests',testMatch:'*.spec.js',workers:1,outputDir:'test-results/platform-expansion-artifacts',use:{baseURL,headless:true},reporter:[['list'],['json',{outputFile:process.env.TOOLBOX_RESULT_FILE??'test-results/product-improvements.json'}]],webServer:{command:process.env.TOOLBOX_BASE_URL?'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5180 --strictPort':'npm run dev',url:baseURL,reuseExistingServer:true}});
