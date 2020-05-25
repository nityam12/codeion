{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $('#new-post-form');

    newPostForm.submit(function (e) {
      e.preventDefault();
      // console.log(document.getElementById('images').files);
      const form = new FormData();
      form.append('content', document.getElementById('post-content').value);
      $('#post-content').val("");
      // form.append('images', document.getElementById('images').files[3]);

      if (parseInt(document.getElementById('images').files.length) > 3) {
        alert('You can only upload a maximum of 3 files');
        return;
      }

      const files = document.getElementById('images').files;
      const counter = files.length;
      for (let i = 0; i < counter; i++) {
        form.append('images', files[i]);
      }

      $.ajax({
        type: 'post',
        enctype: 'multipart/form-data',
        url: '/posts/create',
        // data: newPostForm.serialize(),
        data: form,
        // processData: false,
        processData: false,
        contentType: false,
        success: function (data) {
          
          const imj = data.data.post.images;
          // const uop = $(' #grand-image', newPost);
          const newDiv = document.createElement('div');
          const newDivs = document.createElement('div');
          $(newDiv).attr('id','grand-image');
          for (const i of imj) {
            $(newDiv).append(
              '<p class="img-container"><img class="post-img" src="/images/uploads/user_post_img/' + i + '"></p>'
            );
          }

          $(newDivs).append(newDiv);
          const newPost = newPostDom(data.data.post, newDivs);
          console.log(newDiv);
         
          $('#posts-list-container>ul').prepend(newPost);
          deletePost($(' .delete-post-button', newPost));

          // call the create comment class
          new PostComments(data.data.post._id);

          // CHANGE :: enable the functionality of the toggle like button on the new post
          new ToggleLike($(' .toggle-like-button', newPost));

          new Noty({
            theme: 'relax',
            text: 'Post published!',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show(); 
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post,newDivs) {
    return $(`<li id="post-${post._id}">
                    <p>
                        ${post.content}
                        <br>
                        ${newDivs.innerHTML}
                        <br>
                        <br>
                        <small>
                        -- by ${post.user.name}
                        &ensp;&ensp;
                        <small>
                            <a class="delete-post-button"  href="/posts/destroy/${post._id}"><i class="fas fa-times-circle"></i></i></a>
                        </small>

                        
                        <br>
                        <br>
                        <small>
                            
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                            0&ensp;&ensp;<i class="far fa-heart"></i>
                        </a>
                    
                </small>

                    </p>
                           
                    <div class="post-comments">
                        
                            <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type Here to add comment..." required>
                                <input type="hidden" name="post" value="${post._id}" >
                                <input type="submit" value="Comment">
                            </form>
               
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                                
                            </ul>
                        </div>
                    </div>
                    
                </li>`);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'), //to extract href data from a tag
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: 'relax',
            text: 'Post Deleted',
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $('#posts-list-container>ul>li').each(function () {
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split('-')[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
