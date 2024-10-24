Java.perform(function () {
  var Activity = Java.use("android.app.Activity");
  // var File = Java.use("java.io.File");
  // var FileInputStream = Java.use("java.io.FileInputStream");
  // var Runtime = Java.use('java.lang.Runtime');
  // var Bitmap = Java.use('android.graphics.Bitmap');
  // var ByteArrayOutputStream = Java.use('java.io.ByteArrayOutputStream');
  var Base64 = Java.use('android.util.Base64');
  var BitmapFactory = Java.use('android.graphics.BitmapFactory');
  // var dataClass = Java.use('android.content.Intent').class;
  // var Bundle = Java.use('android.os.Bundle');

  // var customData = readImageFromFile();

  var cameraRequestCode = null;

  // Hooking the startActivityForResult method
  Activity.startActivityForResult.overload("android.content.Intent", "int").implementation = function (intent, requestCode) {
    var action = intent.getAction();
    console.info("Action Captured--->", action);
    if (action === "android.media.action.IMAGE_CAPTURE") { 
      cameraRequestCode = requestCode;
      console.log("Camera intent captured in startActivityForResult!");

    } 
    console.debug("requestCode--->", cameraRequestCode);
    // Call the original method
    return this.startActivityForResult(intent, requestCode);
  };

  Activity.onActivityResult.implementation = function(requestCode,resultCode, data) {
    console.log("requestCode--->", requestCode, "resultCode--->", resultCode, "data--->", data);
    if (requestCode === cameraRequestCode) { // Adjust requestCode as needed

      var base64String = readImageFromFile();
      var customImageBytes = Base64.decode(base64String, 0);
      var customBitmap = BitmapFactory.decodeByteArray(customImageBytes, 0, customImageBytes.length);

      console.log('customBitmap--->',customBitmap);

      var extras = data.getExtras();
      var originalBitmap = extras.getParcelable('data');

      console.log('originalBitmap--->', originalBitmap);
      if (originalBitmap.$className === 'android.graphics.Bitmap') {

        var dataClass = Java.use('android.content.Intent');
        var extrasClass = Java.use('android.os.Bundle');
        var newExtras = extrasClass.$new();
        newExtras.putParcelable('data', customBitmap);
        dataClass.putExtra.call(data, 'data', customBitmap);

        console.log('Replaced original Bitmap with custom Bitmap');
      }
    }
    return Activity.onActivityResult.call(this, requestCode, resultCode, data);
  };


});

function readImageFromFile() {

  return `/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAARADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD94PiX8Q9M+E3w/wBZ8TazK8Ol6FaSXtyyLufYikkKO7HGAO5IFeaeEPij8V9T1LRdU1rw34E0Pw9rDo8mnT63Kusadbt/y0c+X5LyKCC0anAJwHOM16N8Wfhrp/xk+Geu+FdW80afr9lJZTtE22SMOpG5T2ZTgj3Ar5++Jf7J/wAQPj14fsfC/jaz+FuqW9nD9gPi9rWWXWPspKhzDbOnlwXDqoy4lZVb5gvAFfUZHSy+pSccTKMW2+Zyu2oW0cEpRu735lfm+HlT948XMp4uM70U2raJWV5X1UnZ2VrW0tvd7HvFx8cfBlr8RY/CMnivw7H4pmUMmktqEQvHBG4Yi3bsleQMZI56VrWPjjRdT12bS7fVdPn1G3z5tslwrSpjrlc547+lfNN5+xF4sS51LwraP4PXwZqnjGHxd/b0hm/4SCzEdxFcC3RdhQyAxCJJzKNsRxsJHPoHib9nzVte8DSeHby4sbDSbCK9Mep6akjapMJoZkGE2jDfvSWwzFyoxjPH5Xjs0zanjKFGhh+anOVpSs3yrmiraPT3XKfO7x9zktzSTP0TMMryqjh1UoYjmlyt2ut+W6e2l5e7yP3o/E3YsfFj9s3wj4U+H+r6j4Y1/wAL+KtY0qeCFtNttVjeQh7qGCQkIWbCednOMZAFd7oPxl8I+KfG+oeGdN8TaDf+IdJz9s023vo5Lq2xwd8YO4YJAPHBIzjNfEXhbwXrH7T3iPwv4b0NPA6x+EfCpsJb/SrS8tVtwl7p7pHdiWFDbyuttIVthvKMHJbBBr2D9mr9ijxD8FPizYXWqr4c17SfD91qM2mazc6hdyajDHdO7bIrQKtvDId5EsxaVpcds/L9zxRl9XLMwp4ahFuMopu+8XzSXRJ6xSlqtNF1ufJ8IyoZjSxmIx1Xk5Iw9mklacrTctW9bPki0nd83Mr8skfUVFFFcRQUUUUAFFFFABRRRQAUUUUAf//Z`;
}
