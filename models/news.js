module.exports =
    class News {

        constructor(userId, title, created, description, GUID) {
            this.Id = 0;
            this.UserId = userId !== undefined ? userId : 0;

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            //this.date = dateTime;
            this.Created = created !== undefined ? created : dateTime;

            this.Title = title !== undefined ? title : "";
            this.Description = description !== undefined ? description : "";
            this.GUID = GUID !== undefined ? GUID : "";
        }
        static valid(instance) {
            const Validator = new require('./validator');
            let validator = new Validator();
            validator.addField('Id', 'integer');
            validator.addField('UserId', 'integer');
            validator.addField('Title', 'string');
            validator.addField('Description', 'string');
            validator.addField('Created','integer');
            return validator.test(instance);
        }
    }