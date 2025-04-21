import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
var API_URL = 'https://church-tech-backend.onrender.com';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5413,
        proxy: {
            '/api': {
                target: API_URL,
                changeOrigin: true,
                secure: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); },
                configure: function (proxy, options) {
                    proxy.on('error', function (err, req, res) {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', function (proxyReq, req, res) {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
            },
            '/authentication': {
                target: API_URL,
                changeOrigin: true,
                secure: true,
                configure: function (proxy, options) {
                    proxy.on('error', function (err, req, res) {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', function (proxyReq, req, res) {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
            },
            '/event': {
                target: API_URL,
                changeOrigin: true,
                secure: true,
                configure: function (proxy, options) {
                    proxy.on('error', function (err, req, res) {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', function (proxyReq, req, res) {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
            },
            '/members': {
                target: API_URL,
                changeOrigin: true,
                secure: true,
                configure: function (proxy, options) {
                    proxy.on('error', function (err, req, res) {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', function (proxyReq, req, res) {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', function (proxyRes, req, res) {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
            }
        },
        cors: {
            origin: true,
            credentials: false
        }
    },
    preview: {
        port: 4173,
        proxy: {
            '/api': {
                target: API_URL,
                changeOrigin: true,
                secure: true,
                rewrite: function (path) { return path.replace(/^\/api/, ''); }
            },
            '/authentication': {
                target: API_URL,
                changeOrigin: true,
                secure: true
            },
            '/event': {
                target: API_URL,
                changeOrigin: true,
                secure: true
            },
            '/members': {
                target: API_URL,
                changeOrigin: true,
                secure: true
            }
        }
    }
});
