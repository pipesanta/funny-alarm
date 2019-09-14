const Datastore = require('nedb');
const users = new Datastore({ filename: 'users.db', autoload: true });

// const users = new Datastore();

const scott = {
    name: 'Scott',
    twitter: '@ScottWRobinson1'
};

// users.insert(scott, function(err, doc) {
//     console.log('Inserted', doc.name, 'with ID', doc._id);
// });


users.findOne({ twitter: '@ScottWRobinson12' }, function(err, doc) {
    console.log('Found user:', doc);
});
