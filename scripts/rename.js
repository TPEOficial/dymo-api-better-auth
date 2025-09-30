import fs from "fs";
import path from "path";

function renameToCJS(dir = "./dist/cjs") {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (file === "." || file === "..") continue;
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) renameToCJS(fullPath);
        else if (stats.isFile() && path.extname(fullPath) === ".js") fs.renameSync(fullPath, fullPath.replace(/\.js$/, ".cjs"));
    }
};

function fixRequireCJSExtensions(dir = "./dist/cjs") {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) fixRequireCJSExtensions(fullPath);
        else if (path.extname(fullPath) === ".cjs") {
            let content = fs.readFileSync(fullPath, "utf8");
            content = content.replace(/require\((['"`])([^'"\)]+)\1\)/g, (match, quote, reqPath) => {
                const fullFilePath = path.resolve(dir, reqPath);
                if (fs.existsSync(`${fullFilePath}.cjs`)) return `require(${quote}${reqPath}.cjs${quote})`;
                if (fs.existsSync(path.join(fullFilePath, "index.cjs"))) return `require(${quote}${reqPath}/index.cjs${quote})`;
                return match;
            });
            fs.writeFileSync(fullPath, content, "utf8");
            console.log(`Fixed imports in: ${fullPath}`);
        }
    }
};

function fixRequireESMExtensions(dir = "./dist/esm") {
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) fixRequireESMExtensions(fullPath);
        else if (path.extname(fullPath) === ".js") {
            let content = fs.readFileSync(fullPath, "utf8");
            content = content.replace(/import\s+(?:type\s+)?(?:(\* as \w+)|(?:\w+\s*,\s*)?{[^}]*}|\w+)?\s+from\s+["']([^"']+)["'];/g,
                (match, starImport, reqPath) => {
                    const fullFilePath = path.resolve(dir, reqPath);

                    if ((/^[\.\/]+/.test(reqPath) || reqPath.includes("./")) && !reqPath.includes(".js")) {
                        if (fs.existsSync(`${fullFilePath}.js`)) return match.replace(reqPath, `${reqPath}.js`);
                        if (fs.existsSync(path.join(fullFilePath, "index.js"))) return match.replace(reqPath, `${reqPath}/index.js`);
                    }
                    return match;
                }
            );
            fs.writeFileSync(fullPath, content, "utf8");
            console.log(`Fixed imports in: ${fullPath}`);
        }
    }
};

renameToCJS();
fixRequireCJSExtensions();
fixRequireESMExtensions();