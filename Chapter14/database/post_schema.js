let crypto = require('crypto');
let utils = require('../utils/utils')

let SchemaObj = {};

SchemaObj.createSchema = function(mongoose) {
    let PostSchema = mongoose.Schema({
        title: {type: String, trim: true, 'default': ""}
      , contents: {type:String, trim: true}
      , writer: {type: mongoose.Schema.ObjectId, ref: 'user5'} //ref는 몽고디비에서 여러 컬렉션을 연결해주는 키의 역할을 함.
      , comments: [{
            contents: {type: String, trim:true, 'default': ''},
            writer: {type: mongoose.Schema.ObjectId, ref: 'users5'},
            created_at: {type: Date, 'default': Date.now}
        }],
      tags: {type: [], 'default': ''},
      created_at: {type: Date, index: {unique: false}, 'default': Date.now},
      updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
    PostSchema.path('contents').required(true, '글 내용 입력하셔야 합니다.');

    PostSchema.methods = {
      savePost: function(callback) {
        let self = this;

        this.validate(function(err) {
          if(err) return callback(err);

          self.save(callback);
        })
      },
      addComment: function(user, comment, callback) {
        this.comment.push({
          comments: comment.contents,
          writer: user._id
        });
        this.save(callback);
      },
      removeComment: function(id, callback) {
        let index = utils.indexOf(this.comments, {id: id});

        if(~index) {
          this.comments.splice(index, 1);
        } else {
          return callback('ID [' + id + ']를 가진 댓글 객체를 찾을 수 없습니다.');
        }
        this.save(callback);
      },
    }

    PostSchema.statics = {
      load: function(id, callback) {
        this.findOne({_id: id})
          .populate('writer', 'name provider email') //populate: ObjectId로 참조한 다른 객체를 가져와 데이터를 채워준다.
          .populate('comments.writer')
          .exec(callback);
      },
      lest: function(options, callback) {
        let criteria = options.criteria || {};

        this.find(criteria)
          .populate('writer', 'name provider email')
          .sort({'created_at': -1})
          .limit(Number(options.perPage))
          .skip(options.perPage * options.page)
          .exec(callback);
      },
    }

    console.log('PostSchema 정의함');

    return PostSchema;
}

module.exports = SchemaObj;