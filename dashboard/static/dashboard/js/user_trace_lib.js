
function Storage() {
   var self = this;
   self.storage = localStorage;
   var storage = {
       get: get,
       set: set,
       remove: remove,
       clear: clear
   };
   return storage;

   function get(key) {
       return JSON.parse(self.storage.getItem(key));
   }

   function set(key, value) {
       return self.storage.setItem(key, JSON.stringify(value));
   }

   function remove(key) {
       return self.storage.removeItem(key);
   }

   function clear() {
       self.storage.clear();
   }
}

function UserTrace() {
    var url_server = "https://user-trace-py.herokuapp.com";
    var userTrace = {
        send: send
    };

    var hashCode = function(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    };

    var create_trace = function (url_pathname, access_date) {
        return {"url": url_pathname, "date_access": access_date};
    };

    var create_data_cache = function(email, url_pathname, access_date) {
        data = {
            "email": email,
            "contacttrace": [create_trace(url_pathname, access_date)]};
        return data;
    };

    var get_data_cache = function(data_cache, email, url_pathname, access_date) {
        data_cache['email'] = email;
        contacttrace = [];
        if (data_cache['contacttrace']) {
            contacttrace = data_cache['contacttrace'];
            contacttrace.push(create_trace(url_pathname, access_date));
        } else {
            contacttrace = [create_trace(url_pathname, access_date)];
        }
        data_cache['contacttrace'] = contacttrace;
        return data_cache;
    };

    var clear_trace = function() {
        data = Storage().get('user_trace');
        data["contacttrace"] = [];
        Storage().set('user_trace', data);
    };

    var send_trace = function() {
        var data = Storage().get('user_trace');

        $.ajax({
            type: "POST",
            url: url_server + "/contacts.json",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            statusCode: {
                201: function (resp) {
                    console.log(resp);
                    clear_trace();
                },
                200: function (resp) {
                    console.log(resp);
                    clear_trace();
                },
                500: function (resp) {
                    console.log(resp)
                }
            }
        });
    };

    return userTrace;

    function send(email) {
        if (email !== undefined && email.length > 3) {
            data_cache = Storage().get('user_trace');
            data_cache['email'] = email;
            Storage().set('user_trace', data_cache);
            send_trace();
            return;
        }

        url_pathname = window.location.pathname.replace("/",'');
        access_date = new Date().toLocaleString();

        data_cache = Storage().get('user_trace');
        if (data_cache !== null){
            data_cache = get_data_cache(data_cache, data_cache['email'], url_pathname, access_date);
            //user_identifier = hashCode(new Date().toLocaleString());
        }
        else {
            data_cache = create_data_cache(email, url_pathname, access_date);
        }
        Storage().set('user_trace', data_cache);

        if (data_cache['email'] && data_cache['email'].length > 3)
            send_trace();
    }
}

UserTrace().send();
