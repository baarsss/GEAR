// Cross-platform production build for an independent Node.js host.
process.env.GEAR_RUNTIME = "node";
process.argv = [process.execPath, process.argv[1], "build"];
await import("../node_modules/vinext/dist/cli.js");
