function Jukebox()
{
  this.playing = false;
  this.songs = [new Song(new Audio('songs/bensound-acousticbreeze.mp3'),"Acoustic Breeze", "Bensound"),
                new Song(new Audio('songs/bensound-goinghigher.mp3'),"Going Higher","Bensound"),
                new Song(new Audio('songs/bensound-tomorrow.mp3'),"Tomorrow","Bensound")
               ]
  this.current = this.songs[0];//current song playing
  this.currentIndex = 0;//index of current song in playlist
  this.play = function()
  {
    this.current.play();
    this.playing = true;
    toggle("play");
  }
  this.pause = function(){ //to pause current song
      this.current.pause();
      this.playing = false;
      toggle("pause");
    };
  this.stop = function(){ //prevents songs from all playing at once
      if (this.playing === true) toggle("pause"); //turn pause back into play
        this.current.stop();
        this.playing = false;
      };

  this.select = function(index){ //select a song from the list
      if (this.playing === true) this.stop();
        this.currentIndex = index;
        this.current = this.songs[index];
        $("#artist").text("Current song: " + this.current.artist);
        $("#title").text("Artist: " + this.current.title);
        //this.updateVolume(this.volume);
        this.play();
      };
  this.next = function(){ //select the next song in the list
      if (this.playing === true) this.stop();
        this.currentIndex++;
        this.currentIndex %= this.songs.length;//stops it from going out of bounds
        this.select(this.currentIndex);
        this.play();
      };
  this.previous = function(){ //select previous song in the list
      if (this.playing === true) this.stop();
        this.currentIndex--;
        this.currentIndex = (this.currentIndex + this.songs.length) % this.songs.length;
        this.select(this.currentIndex);
        this.play();
        //console.log(this.currentIndex);
      };
}

  jukebox = new Jukebox();
  playlist = $(".songItem");
  for (i = 0; i < playlist.length; i++)
  {
    //give this item its index
    playlist[i].index = i;
    //attach event listener for user click
    $(playlist[i]).on("click", function()
    {
      jukebox.select(this.index);
    });
  }
  $("#play").on("click", function(){//event listeners start here
    if (jukebox.playing === false) jukebox.play();
    else jukebox.pause();

  });

  $("#rewind").on("click", function(){
    jukebox.previous();
  });

  $("#forward").on("click", function(){
      jukebox.next();
    });

  $("#shuffle").on("click", function(){
      rand = Math.floor(Math.random() * jukebox.songs.length);
      jukebox.select(rand);
    });

  $("#stop").on("click",function(){
    jukebox.stop();
    console.log('butts');
  })

  $(".searchForm").on("submit", function(){
      $.ajax(
        "https://api.spotify.com/v1/search",
        {
          data:
          {
            q: $("#search").val(),
            type: "track",
          },
          success: function(response){
            if (response.tracks.items.length)
            {
              //format the track into a song object
              track = response.tracks.items[0];
              console.log(track);
              audio = new Audio(track.preview_url);
              title = track.name;
              artist = track.artists[0].name;
              song = new Song(audio, title, artist);
              //add song to jukebox playlist
              jukebox.songs.push(song);
              //add title to UI playlist
              $(".songsList").append("<p class='songItem'>" + artist + " - " + title + "</p>");
              //add event listener to the new playlist item
              index = jukebox.songs.length - 1;
              item = $(".songItem")[index];
              item.index = index;
              $(item).on("click", function()
              {
                jukebox.select(this.index);
              });
              //finally, switch to this track automatically
              jukebox.select(index);
            }
            else {
              $(".noResults").text("No results");
              setTimeout(function(){
                $(".noResults").text("");
              }, 2000);
            }
          }
        });
    });



function Song(audio, artist, title)
{
  this.audio = audio;
  this.artist = artist;
  this.title = title;
  this.play = function (){
    this.audio.play();
  }
  this.pause = function(){
    this.audio.pause();
  }

  this.stop = function(){
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
function toggle(buttonID)
{
  elem = document.getElementById(buttonID)
  if (buttonID === "play")
  {
    elem.id = "pause";
    elem.title = "Pause";
  }
  else
  {
    elem.id = "play";
    elem.title = "Play";
  }
}
