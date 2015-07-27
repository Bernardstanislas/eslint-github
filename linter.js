var clone = require('nodegit').Clone.clone;
var exec = require('child_process').exec;

function lint(data) {
    var files = {};
    data.commits.map(function(commit) {
        function addToFiles(file) {
            files[file] = true;
        }
        commit.added.map(addToFiles);
        commit.removed.map(addToFiles);
        commit.modified.map(addToFiles);
    });
    var filesString = '';
    Object.keys(files).map(function(filename) {
        filesString += filename + ' ';
    });
    var child = exec('cd repo && eslint --format node_modules/eslint-json/json.js ' + filesString + ' > output.json');
    child.on('close', function() {
        var result = require('./repo/output.json');
        console.log('SUCCESS');
        console.log(result);
    });
}

function npmInstall(data) {
    var child = exec('cd repo && npm install eslint-json && npm install');
    child.on('close', function() {
        lint(data);
    });
}

var linter = {
    onPush: function(data) {
        clone(data.repository.git_url, "repo", null)
        .then(function(repo) {
            return repo.getCommit(data.head_commit.id);
        })
        .then(function() {
            npmInstall(data);
        });
    }
};

module.exports = linter;
