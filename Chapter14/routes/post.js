let addpost = function(req, res) {
    console.log('post 모듈 안에 있는 addpost 호추로딤');

    let paramTitle = req.body.title || req.query.title;
    let paramContent = req.body.contents || req.query.contents;
    let paramWriter = req.body.writer || req.query.writer;

    let database = req.app.get('database');

    if(database.db) {
        database.UserModel.findByEmail(paramWriter, function(err, results) {
            if(err) {
                console.error('게시판 글 추가 중 오류 발생' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>게시판 글 추가 중 오류발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if(results == undefined || results.length < 1) {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('사용자를 찾을 수 없습니다.');
                res.end();

                return;
            }

            let userObjetId= results[0]._doc._id;

            let post = new database.PostModel({
                title: paramTitle,
                contents: paramContent,
                writer: userObjetId
            })

            post.savePost(function(err, result) {
                if(err) {throw err;}

                return res.redirect('/process/showpost/' + post.id);
            });
        })
    }
}

let showpost = function(req, res) {
    let paramId = req.body.id || req.query.id || req.param.id;

    let database = req.app.get('database');

    if(database.db) {
        database.PostModel.load(paramId, function(err, results) {
            if(err) {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>게시판 글 조회 중 오류발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
            }
            
            if(results) {
                console.dir(results);
                res.write('200', {'Content-Type': 'text/html;charset=utf8'});

                let context = {
                    title: '글 조회',
                    posts: results,
                    Entities: Entities
                }

                req.app.render('showpost', context, function(err, html) {
                    if(err) {throw err;}

                    res.end(html);
                });
            }
        });
    }
}

module.exports.addpost = addpost;
module.exports.showpost = showpost;

