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
    console.log('Files to lint : ', filesString);
    var child = exec('cd ' + data.repository.name + ' && eslint --format node_modules/eslint-json/json.js ' + filesString + ' > output.json');
    child.on('close', function() {
        var result = require('./repo/output.json');
        console.log('SUCCESS');
        console.log(result);
    });
}

function npmInstall(data) {
    console.log('Starting npm install');
    var child = exec('cd ' + data.repository.name + ' && npm install eslint-json && npm install');
    child.on('close', function() {
        console.log('Npm install done');
        lint(data);
    });
}

var linter = {
    onPush: function(data) {
        clone(data.repository.html_url + '.git', './', null)
        .then(function(repo) {
            return repo.getCommit(data.head_commit.id);
        })
        .then(function() {
            npmInstall(data);
        });
    }
};

module.exports = linter;
