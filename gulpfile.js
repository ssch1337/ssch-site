const gulp = require("gulp"),
	uglify = require("gulp-uglify"), // For compression js
	buffer = require("vinyl-buffer"), // For uglify
	/* For development only */
	sourcemaps = require("gulp-sourcemaps"), // To build source maps(ts, sass)
	watchify = require("watchify"), // For incremental build and tracking changes in browserify
	fancy_log = require("fancy-log"), // To display logs in watchify
	/* For development only */
	browserify = require("browserify"), // Build js into one file
	source = require("vinyl-source-stream"), // For browserify
	tsify = require("tsify"), // Browserify compilation plugin
	glslifyRequire = require('glslify-require'), // Browserify glsl require plugin
	gulpif = require("gulp-if"), // To implement logic in Readable Stream
	sass = require("gulp-sass")(require("sass")),
	rename = require("gulp-rename"), // For the .min extension
	/* Compressing files with brotli and zopfli */
	brotli = require('gulp-brotli'), // To compress files
	zopfli = require('gulp-zopfli-green'), // Backward compatible with .gz
	zlib = require('zlib'),
	/* Compressing files with brotli and zopfli */
	fs = require("fs"); // For reading tsconfig.json

class tsBuild {
	/* projectsNames — array, production — boolean */
	constructor(projectNames, production) {
		if(!Array.isArray(projectNames)) {
			throw "Please initialize the class correctly. tsBuild([element0,...], boolean)";
		}
		this.bundle = new Array();
		this.bundler = new Array();
		this.projectNames = new Array();
		this.production = production; // For checks when starting watch
		this.originalNames = projectNames; // Required for logs
		this.isWatching = false; // Modified value during call watch

		projectNames.forEach((projectName, index) => {
			// Generating a task name
			this.projectNames.push("tsBuild" +
				(production ? "Prod" : "Dev") +
				projectName[0].toUpperCase() + projectName.slice(1));

			gulp.task(this.projectNames[index].toString(), () => {
				this.bundler[index] = browserify({
					basedir: ".",
					debug: !production,
					entries: [`src/${projectName}/typescript/main.ts${tsxEnable.indexOf(projectName) != -1 ? "x" : ""}`],
					cache: {},
					packageCache: {},
					extensions: ['.tsx']
				}).plugin(tsify, { project: `src/${projectName}/tsconfig.json` }).plugin(glslifyRequire);

				this.bundle[index] = () => {
					return this.bundler[index].bundle()
					.pipe(source(`${projectName}.js`))
					.pipe(buffer())
					.pipe(gulpif(!production, sourcemaps.init({ loadMaps: true }))) // For development only
					.pipe(uglify())
					.pipe(gulpif(!production, sourcemaps.write("./"))) // For development only
					.pipe(gulpif(production, rename((path) => {
						path.basename += ".min";
					})))
					.pipe(gulp.dest("dist"));
				}
				/* For development only */
				if(this.isWatching) {
					const watchedBrowserify = watchify(this.bundler[index]);
					watchedBrowserify.on("update", this.bundle[index]);
					watchedBrowserify.on("log", fancy_log);
				}
				/* For development only */
				return this.bundle[index]();
			});
		});
	}

	compile(callback) {
		console.log(`Compile typescript project${this.originalNames.length == 1 ? "" : "s"} ${this.originalNames.join(", ")} in ${this.production ? "production" : "development"} mode`);
		return gulp.series(this.projectNames)(() => {
			if(callback) { callback(); }
		});
	}

	watch() {
		if(this.production) {
			throw "It is forbidden to run watch in production mode";
		}
		this.isWatching = true;
		gulp.series(this.projectNames);
	}
}


class sassBuild {
	constructor(projectNames, production) {
		if(!Array.isArray(projectNames)) {
			throw "Please initialize the class correctly. sassBuild([element0,...], boolean)";
		}
		this.projectNames = new Array();
		this.production = production; // For checks when starting watch
		this.originalNames = projectNames; // Required for logs

		projectNames.forEach(projectName => {
			// Generating a task name
			this.projectNames.push("sassBuild" +
				(production ? "Prod" : "Dev") +
				projectName[0].toUpperCase() + projectName.slice(1));

			gulp.task(this.projectNames.slice(-1).toString(), () => {
				return gulp.src(`src/${projectName}/sass/main.scss`)
					.pipe(gulpif(!production, sourcemaps.init())) // For development only
					.pipe(sass.sync({outputStyle: `${production ? "compressed" : "expanded"}`}).on("error", sass.logError))
					.pipe(rename((path)=>{
						path.basename = `${projectName}${production ? ".min" : ""}`
					}))
					.pipe(gulpif(!production, sourcemaps.write("./"))) // For development only
					.pipe(gulp.dest("dist"));
			});
		});
	}
	compile(callback) {
		console.log(`Compile sass project${this.originalNames.length == 1 ? "" : "s"} ${this.originalNames.join(", ")} in ${this.production ? "production" : "development"} mode`);
		return gulp.series(this.projectNames)(() => {
			if(callback) { callback(); }
		});
	}
	watch() {
		if(this.production) {
			throw "It is forbidden to run watch in production mode";
		}
		this.originalNames.forEach((name, index) => {
			gulp.watch(`src/${name}/sass/*`, gulp.series(this.projectNames[index]));
		});
	}
}


const projects = ["preloader", "main", "experimental"];
const tsxEnable = ["main"];

/*/
 * Selective compilation.
 * Just enter the name of the project in the name of the task,
 * in the developer mode add the postfix "Dev"
 * and add the postfix "Watch" to track the changes.
 * Existing tasks can be viewed by the command "gulp --tasks"
/*/
projects.forEach((project) => {
	for(let production = false; production <= 1; production++) {
		gulp.task(`${project}${production == false ? "Dev" : ""}`, async () => {
				new sassBuild([project], production).compile();
				new tsBuild([project], production).compile();
		});
		if(!production) {
			gulp.task(`${project}DevWatch`, () => {
				const watchedSass = new sassBuild([project], false);
				const watchedTs = new tsBuild([project], false);
				watchedSass.watch();
				watchedSass.compile();
				watchedTs.watch();
				watchedTs.compile();
			});
		}
	}
});

gulp.task("watch", () => {
	const watchedSass = new sassBuild(projects, false);
	const watchedTs = new tsBuild(projects, false);
	watchedSass.watch();
	watchedSass.compile();
	watchedTs.watch();
	watchedTs.compile();
});

gulp.task("anime", () => {
	return gulp.src(__dirname + '/node_modules/animejs/lib/anime.min.js')
		.pipe(gulp.dest("dist/deps"));
})

gulp.task("zopfli", () => {
	return gulp.src(['dist/**/*.js', 'dist/**/*.css'])
		.pipe(zopfli())
		.pipe(gulp.dest('dist'));
});

gulp.task("brotli", () => {
	return gulp.src(['dist/**/*.js', 'dist/**/*.css'])
		.pipe(brotli.compress({
			params: {
			  [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
			},
		  }))
		.pipe(gulp.dest('dist'));
});

gulp.task("default", gulp.series(
	"anime",
	gulp.parallel(
		function tsBuilder () {
			const ts = new tsBuild(projects, true);
			return new Promise((resolve,reject) => {
				ts.compile(resolve);
			})
		},
		function sassBuilder () {
			const sass = new sassBuild(projects, true);
			return new Promise((resolve,reject) => {
				sass.compile(resolve);
			})
		}
	),
	gulp.parallel("brotli", "zopfli")
));


gulp.task("dev", async () => {
	new sassBuild(projects, false).compile();
	new tsBuild(projects, false).compile();
});