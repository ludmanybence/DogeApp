<template>
<div>
    <div class="row" id="top-buffer">
    <div class="col-sm-3"></div>
    <div class="col-sm-3" >
        <button class="success-btn" onclick="document.getElementById('post-modal').style.display='block'" style="width:auto;" exact v-if="userType=='OWNER'" >Create new post</button>
        <button class="delete-btn" id="deleteBtn" style="width:auto;" v-on:click="deletePosts(userId)" v-if="userType=='OWNER'">Delete all posts</button>
        <div id="post-modal" class="modal">
            <form class="modal-content animate" action="#/timeline">
                <div class="imgcontainer">
                    <span onclick="document.getElementById('post-modal').style.display='none'" class="close" title="Close Modal">&times;</span>
                    <img src="resources/images/dog.jpg" width="150" alt="Avatar" class="avatar">
                </div>

                 <div class="container">
                    <label for="information" id="post-text-head" align="center"><b>Create new post</b></label>
                     <p> 
                    <textarea id="info-text"  rows="5" placeholder="Add information..." v-model="Post.text"></textarea>
                    </p>
                    <input id="walkTime" type="datetime-local" name="walk-time" v-model="Post.walkOrder">
                    <button type="button" class="success-btn" id="sub-button" v-on:click="createPost">Submit post</button>
                    
                 </div>

                <div class="container" style="background-color:#f1f1f1">
                     <button type="button" id="cancelPost" onclick="document.getElementById('post-modal').style.display='none'" class="cancelbtn">Cancel</button>
      
                </div>
             </form>
        </div>
            
    </div>
    <div class="col-sm-6"></div>
    </div>

    <div class="row"> 
        <div class="col-sm-4"></div>
        <div class="text-center col-sm-4"><h3>Posts</h3></div>
        <div class="col-sm-4"></div>
    </div>

    <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8 col-xs-12">
             <post v-for="post in posts" :key="post._id" :post="post" v-on:delete="deletePost(post._id)" v-on:claim="claimPost(post._id)" v-on:cancel="cancelClaimToPost(post._id)"></post>            
        </div>
    </div>
    <!-- Have not yet managed to display name instead of ID of postedBy -->

</div>

</template>


<script> 
const axios = require('axios');
import Post from './Post.vue';
module.exports = {
    name:"Timeline",
    components:{
        'post':Post
    },
    data(){
        return {
            showById:null,
            posts: [], 
             Post: {postedBy:'', text:'', walker:'', created:'', lastModified:'', walkOrder:'' }    
        }
    },
  methods: {
     
  
        deletePosts: function(UserId){
        
        for(var i=0; i<this.posts.length; i++){
            console.log("test" + this.posts[i].postedBy._id + UserId);
            if(this.posts[i].postedBy._id === UserId){
           var postID = this.posts[i]._id;
        axios.delete('/api/posts/'+postID)
            .then(
                response => {
                    console.log("Success: " + response.status);
            })
            .catch(error => {
                console.log(error);
            })
            .then(function () {
            });
           }}
           this.posts=[];
        },
    


      claimPost: function(id){
           axios({
                method: 'patch',
                url: '/api/posts/'+id,
                data: {
                    walker: this.userId
                }
            }).then( response=> {
            if(response.status==200){
                alert('You claimed this walk');
             }    
            }).then(response =>{
                 this.getPosts();
            });
           
        },
         cancelClaimToPost: function(id){
            axios({
                method: 'patch',
                url: '/api/posts/'+id,
                data: {
                    walker: null
                }
                
            }).then(response =>{
                 this.getPosts();
            });
           
        },
      
      createPost: function(){
           let newPost = {
               text : this.Post.text,
               walker : null,
               time:{ 
               created : Date.now(),
               lastModified : null,
               walkOrder : this.Post.walkOrder
               }
           };
            axios({
                method: 'post',
                url: '/api/posts',
                data: newPost   
            })
            .then( response => {
               if(response.status==201){
                alert('Your post was created,');
                document.getElementById('post-modal').style.display='none'
                this.getPosts();
               }    
            });
        },
        
        getPosts: function () {
            axios.get('/api/posts/')
            .then(
                response => {
                    if (response.status!==200) {
                        console.log("Wrong status code: " + response.status);
                    }
                    this.posts.length = 0;
                    for (var i = 0; i < response.data.data.length; i++) {
                        let current = response.data.data[i];
                        if(this.userType === 'OWNER' ){
                            if(current.postedBy._id === this.userId){
                                this.posts.push(current);
                            }
                        }
                        else if(this.userType==='WALKER'){
                            this.posts.push(current);
                        }
                    }
            })
            .catch(error => {
                this.posts.length = 0;
                console.log(error);
            })
            .then(data => {
            
            })
          },      
           
           deletePost: function (postID) {
            axios.delete('/api/posts/'+postID)
            .then(
                response => {
                    var localIndex = -1;
                    for (var i=0; i < this.posts.length; i++) {
                        if (this.posts[i]._id === postID) {
                            localIndex = i;
                            i = this.posts.length;
                }
                    }
                    if (localIndex !== -1) {
                        this.posts.splice(localIndex, 1); 
                    }
                    console.log("Success: " + response.status);
            })
            .catch(error => {
                console.log(error);
            })
            .then(function () {
            });
           }
    }, 
           
    mounted () {
        this.getPosts();
       
         
},

    
 computed:{
        userType(){
            return this.$store.state.userInstance.role;
        },
        userId(){
           return this.$store.state.userInstance._id
        },
        user(){
           return this.$store.state.userInstance
        }
    }
}
var modal = document.getElementById('post-modal');
 

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
</script>


<style scoped>
#delete-post{
    background-color: transparent;
    color:black;
    border: none;

}
#delete-post:hover{
    color:red;
    font-size: 140%
}

#claim-post{
    background-color: transparent;
    color:green;
    border: none;

}
#claim-post:hover{
    
    font-size: 140%
}

#pickup{
    color:dodgerblue;
}
#cancelPost{
      width: 14%;
margin-left: 43%;
margin-right: 43%
}
#walkTime{
    margin-left: auto;
    margin-right: auto;
    align-content: center;
}
#top-buffer{
margin-top: 70px
}
#postStyle{
    font-size: 10px;
}
body {font-family: Arial, Helvetica, sans-serif;}
/* Full-width input fields */
input[type=text], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
/* Set a style for all buttons */
#post-text-head{
    margin-left:220px;
}
#deleteBtn{
    background-color: red;
    color:white;
     box-sizing: border-box;
      padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
}

#sub-button{
  width: 30%;
margin-left: 35%;
margin-right: 35%
    }
.success-btn{
   background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
}
#info-text{
      width: 60%;
margin-left: 20%;
margin-right: 20%;
resize: none;
}
button:hover {
    opacity: 0.8;
}
/* Extra styles for the cancel button */
.cancelbtn {
    width: auto;
    padding: 10px 18px;
    background-color: #f44336;
}
/* Center the image and position the close button */
.imgcontainer {
    text-align: center;
    margin: 24px 0 12px 0;
    position: relative;
}
img.avatar {
    width: 10%;
    border-radius: 50%;
}
.container {
    padding: 16px;
    grid-row-start: 300px;
}
span.psw {
    float: right;
    padding-top: 16px;
}
/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    padding-top: 60px;
}
/* Modal Content/Box */
.modal-content {
    background-color: #fefefe;
    margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
}
/* The Close Button (x) */
.close {
    position: absolute;
    right: 25px;
    top: 0;
    color: #000;
    font-size: 35px;
    font-weight: bold;
}
.close:hover,
.close:focus {
    color: red;
    cursor: pointer;
}
/* Add Zoom Animation */
.animate {
    -webkit-animation: animatezoom 0.6s;
    animation: animatezoom 0.6s
}
@-webkit-keyframes animatezoom {
    from {-webkit-transform: scale(0)} 
    to {-webkit-transform: scale(1)}
}
    
@keyframes animatezoom {
    from {transform: scale(0)} 
    to {transform: scale(1)}
}
/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
    span.psw {
       display: block;
       float: none;
    }
    .cancelbtn {
       width: 100%;
    }
}
</style>
