function appendToWidget(parentSelector, tag, classes, html) {
    var parentNode = document.querySelector(parentSelector);
    var childNode = document.createElement(tag);
    childNode.innerHTML = html;
    childNode.className += classes;
    parentNode.appendChild(childNode);
}


function getJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 200) {
            var data = JSON.parse(request.responseText);
            callback(data);
        }
    };
    request.send();
}


function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}



function start() {
    appendToWidget("body", "style", "", "@import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);.gh-widget-link,.gh-widget-link:hover{text-decoration:none}.gh-widget-container{display:flex;flex-direction:row;flex-wrap:no-wrap;align-items:center;justify-content:center;color:#333;font-family:'Noto Sans',sans-serif}.gh-widget-personal-details .bio,.gh-widget-stats .count{color:#4078C0}.github-widget{border:1px solid #DDD;max-width:350px}.gh-widget-item{flex:1;text-align:center;padding:10px}.gh-widget-repositories .language{text-align:left}.gh-widget-repositories .language div,.gh-widget-repositories .stars div{padding:5px 0}.gh-widget-photo{flex:2}.gh-widget-photo img{border-radius:100%;max-width:90px}.gh-widget-personal-details{flex:6}.gh-widget-personal-details .full-name{font-size:1.5em;line-height:1.5em}.gh-widget-personal-details .location{font-size:.8em}.gh-widget-stats .count{font-size:1.2em;font-weight:700}.gh-widget-repositories .names{flex:2;text-align:left}.gh-widget-repositories .names div{padding:5px 0;text-overflow:ellipsis}.gh-widget-follow{flex:2}.gh-widget-active-time{flex:4;font-size:.8em}.gh-widget-heading{font-weight:400;color:#666}.gh-widget-hr{border:1px solid #DDD}.gh-widget-link{color:#4078C0}.gh-widget-follow button{width:100%;height:2em;border:none;background:#ddd}");
    appendToWidget(".github-widget", "div", "", '<div class="gh-widget-container"><div class="gh-widget-item gh-widget-photo"></div><div class="gh-widget-item gh-widget-personal-details"></div></div><div class="gh-widget-container gh-widget-stats"></div><hr class="gh-widget-hr"><div class="gh-widget-container"><div class="gh-widget-item gh-widget-heading">Top repositories</div></div><div class="gh-widget-repositories"></div><div class="gh-widget-container"><div class="gh-widget-item gh-widget-follow"></div><div class="gh-widget-item gh-widget-active-time"></div></div>')
    var username = document.querySelector(".github-widget").dataset.username;
    fetchRepos(username);
    fetchUserDetails(username);
}


ready(start);


function fetchRepos(username) {
    var url = "https://api.github.com/users/" + username + "/repos";
    getJSON(url, function(response) {
        updateRepoDetails(topRepos(response));
        updateLastPush(lastPushedDay(response));
    });
}


function fetchUserDetails(username) {
    var url = "https://api.github.com/users/" + username;
    getJSON(url, function(response) {
        updateUserDetails(response);
    });
}


function updateLastPush(lastDay) {
    appendToWidget(".gh-widget-active-time", "span", "", 'Last active: ' + (lastDay ? lastDay + ' day(s) ago' : 'Today'));
}


function lastPushedDay(repos) {
    var now = new Date();
    var latestDate;
    var difference = 9999999999999;
    for (var i = 0; i < repos.length; i++) {
        var pushedDate = new Date(repos[i].pushed_at)
        if (now - pushedDate < difference) {
            latestDate = pushedDate;
            difference = now - pushedDate;
        }
    }
    return Math.floor((now - latestDate) / (1000 * 3600 * 24));
}


function updateUserDetails(user) {

    appendToWidget(".gh-widget-personal-details", "div", "full-name", user.name);
    if (user.bio) {
        appendToWidget(".gh-widget-personal-details", "div", "bio", user.bio);
    }
    if (user.location) {
        appendToWidget(".gh-widget-personal-details", "div", "location", '&#9906; ' + user.location);
    }
    appendToWidget(".gh-widget-stats", "div", "gh-widget-item", '<div class="count">' + user.followers + '</div><div class="stat-name">Followers</div>');
    appendToWidget(".gh-widget-stats", "div", "gh-widget-item", '<div class="count">' + user.following + '</div><div class="stat-name">Following</div>');
    appendToWidget(".gh-widget-stats", "div", "gh-widget-item", '<div class="count">' + user.public_repos + '</div><div class="stat-name">Repositories</div>');
    appendToWidget(".gh-widget-photo", "span", "", '<img src="' + user.avatar_url + '">');
    appendToWidget(".gh-widget-follow", "button", "", '<a class="gh-widget-link" target="new" href="' + user.html_url + '">Follow</a>')

}

function updateRepoDetails(repos) {

    for (var i = 0; i < repos.length; i++) {
        var language = repos[i].language ? repos[i].language : "Unknown";
        appendToWidget(".gh-widget-repositories", "div", "gh-widget-container", '<div class="gh-widget-item names"><div><a class="gh-widget-link" href="' + repos[i].repoUrl + '">' + repos[i].name + '</a></div></div><div class="gh-widget-item language"><div>' + language + '</div></div><div class="gh-widget-item stars"><div>&#9733;' + repos[i].stars + '</div></div>');
    }

}

function topRepos(repos) {

    repos.sort(function(a, b) {
        if (a.stargazers_count === b.stargazers_count) {
            return 0;
        } else if (a.stargazers_count > b.stargazers_count) {
            return -1;
        } else {
            return 1;
        }
    })

    repos = repos.slice(0, 3);
    var result = [];
    for (var i in repos) {
        var repo = repos[i];
        result.push({
            name: repo.name,
            stars: repo.stargazers_count,
            language: repo.language,
            repoUrl: repo.html_url

        });
    }
    return result;
}
