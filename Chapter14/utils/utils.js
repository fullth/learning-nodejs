exports.indexOf = function(err, obj) {
    if(err) throw err;
    
    let index = -1;
    let keys = Object.keys(obj);

    let result = arr.filter(function(doc, idx) {
        let matched = 0;

        for(let i = keys.length -1; i >= 0; i--) {
            if(doc[keys[i]] === obj[keys[i]]) {
                matched++;

                if(matched === keys.length) {
                    index = idx;
                    return idx;
                }
            }
        }
    });

    return index;
}