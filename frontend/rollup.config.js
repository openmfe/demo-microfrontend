import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import minify from 'rollup-plugin-minify-html-literals'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife'
    },
    watch: {
        clearScreen: false
    },
    plugins: [
        minify({
            include: ["src/**/*.js"],
            options: {
                shouldMinify(template) {
                    return (template.parts.some(part => {
                        return (
                            part.text.includes('<style') ||
                            part.text.includes('<div')
                        )
                    }))
                }
            },
            failOnError: true
        }),
        copy({
            targets: [
                { src: ['src/openmfe', 'src/fonts', 'src/index.html'], dest: 'dist' },
                {
                    src: 'src/openmfe/openmfe.yaml',
                    dest: 'dist/openmfe',
                    transform: contents => contents.toString()
                        .replace(/__BACKEND_URL__/g, process.env.MFE_BACKEND_URL)
                        .replace(/__FRONTEND_URL__/g, process.env.MFE_FRONTEND_URL)
                }
            ]
        }),
        replace({
            preventAssignment: false,
            '__BACKEND_URL__': process.env.MFE_BACKEND_URL,
            '__FRONTEND_URL__': process.env.MFE_FRONTEND_URL
        }),
        process.env.BUILD === "prod" ? terser({
            mangle: {
                properties: {
                    regex: ['^_']
                }
            }
        }) : null
    ]
}
