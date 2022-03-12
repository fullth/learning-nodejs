let Schema = { };

Schema.createSchema = function(mongoose) {
    UserSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        name: {type: String, index: 'hashed'},
        age: {type: Number, 'default': -1},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    UserSchema.static('findById', function(id, callback) {
        return this.find({id: id}, callback);
    });

    UserSchema.static('findAll', function(callback) {
        return this.find({ }, callback);
    })

    logger.info('스키마가 정의되었습니다.');

    return UserSchema;
}

module.exports = Schema;