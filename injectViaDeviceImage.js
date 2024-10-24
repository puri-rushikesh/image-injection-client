Java.perform(function () {
    var Activity = Java.use("android.app.Activity");
    var File = Java.use("java.io.File");
    var FileInputStream = Java.use("java.io.FileInputStream");
    var ByteArrayOutputStream = Java.use("java.io.ByteArrayOutputStream");
    var Runtime = Java.use('java.lang.Runtime');
  
    var customData = readImageFromFile();
  
    var cameraRequestCode = null;
  
    // Hooking the startActivityForResult method
    Activity.startActivityForResult.overload(
      "android.content.Intent",
      "int"
    ).implementation = function (intent, requestCode) {
      var action = intent.getAction();
      console.info("Action Captured--->", action);
      if (action === "android.media.action.IMAGE_CAPTURE") { 
        cameraRequestCode = requestCode;
  
        var path = "/storage/emulated/0/Download/AnilPhoto.jpg";
  
        // var path = "/storage/emulated/0/Frida/Injection.jpg";
      
        var file = File.$new(path);
        var Context = Java.use('android.content.Context');
        var context = Java.new(Context);
        var file = context.getFileStreamPath(path);
  
        try {
          console.log('File exists:', file.exists());
          console.log('File can read:', file.canRead());
          console.log('File path:', file.getAbsolutePath());
  
          var fis = FileInputStream.$new(file);
          console.log('FileInputStream created', fis);
        } catch (e) {
          console.log('Error creating FileInputStream:', e);
        }
        
        // var bos = ByteArrayOutputStream.$new();
        
        // var buffer = Java.array('byte', 1024);
        // var bytesRead;
      
        // console.info(fis.read(buffer));
      
        // while ((bytesRead = fis.read(buffer)) != -1) {
        //   bos.write(buffer, 0, bytesRead);
        // }
        
        // var bytes = bos.toByteArray();
        // console.log('File bytes:', bytes);
  
        // return this.startActivityForResult(requestCode, modifiedData);
        var modifiedData = Java.use('android.content.Intent');
        modifiedData.putExtra('data', customData);
  
        console.debug("requestCode--->", requestCode);
        console.log("Camera intent captured in startActivityForResult!");
  
      }
      // Call the original method
      return this.startActivityForResult(modifiedData, requestCode);
    };
  });
