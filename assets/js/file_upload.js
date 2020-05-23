function readURL(input) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      
      reader.onload = function(e) {
        $('#blah').attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }
  
  $("#pro").change(function() {
    readURL(this);
  });