import { Plugin } from 'vite';
import { resolve } from 'path';
import { getHtmlPages, getHugoConfig } from './utils';

export interface Options {
    /**
     * Output path to hugo build directory.
     */
    hugoOutDir: string

    /**
     * Root directory of an application.
     */
    appDir: string
}
export default function hugoPlugin({ hugoOutDir, appDir }: Options): Plugin {
    const hugoConfig = getHugoConfig(appDir);

    const ignoreBuildPaths: string[] = [];

    // Ignore default content language as hugo build it into out dir instead of language dir.
    if (hugoConfig.defaultContentLanguage) {
        ignoreBuildPaths.push(resolve(hugoOutDir, hugoConfig.defaultContentLanguage));
    }

    return {
        name: 'vite-plugin-hugo',
        config: () => ({
            root: hugoOutDir,
            resolve: {
                // Resolve aliases
                alias: {
                    // Resolving path in imports.
                    js: resolve(appDir, 'assets', 'js'),
                    '/assets': resolve(appDir, 'assets'),
                    '/plugins': resolve(hugoOutDir, 'plugins'),
                }
            },
            build: {
                // Build vite into the same directory as hugo
                outDir: hugoOutDir,
                // Vite will build app on top of the files generated by hugo build.
                emptyOutDir: false,
                rollupOptions: {
                    // Routing
                    input: getHtmlPages(hugoOutDir, ignoreBuildPaths)
                }
            }
        })
    }
}