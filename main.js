  /*

  */

  $(function(){
    var infoString = '<div class="info-row"><em> Select Any Node </em></div>';
    var layoutPadding = 50;
    var keyXPadding =100;
    var keyYPadding = 50;
    var paddedHeight;
    var layoutDuration = 150;
    var collProject;
    var collSchool;
    var maxZoom = 3;

    // get exported json from cytoscape desktop via ajax
    var graphP = loadData()

    // also get style via ajax
    var styleP = $.ajax({
      url: 'data.cycss',
      type: 'GET',
      dataType: 'text'
    });

    // when both graph export json and style loaded, init cy
    Promise.all([ graphP, styleP ]).then(initCy);

    Element.prototype.remove = function() {
      this.parentElement.removeChild(this);
    }
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
      for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
        }
      }
    }

    function getMaxLabelWidth(eles){

      var maxLabelWidth = 0;

      eles.forEach(function(n){
        var labelWidth = n.boundingBox({ includeLabels : true}).w;

        if(labelWidth > maxLabelWidth){
          maxLabelWidth = labelWidth;
        }
      });
      return maxLabelWidth ;
    }

    function addKey(){

      var titleKey = cy.add({
        group: "nodes",
        data: { id: "titleKey", name: "KEY",  type: "key" }
      });

      var projectKey = cy.add({
        group: "nodes",
        data: { id: "projectKey", name: "Project",  type: "key" }
      });

      projectKey.addClass("project")

      var schoolKey = cy.add({
        group: "nodes",
        data: { id: "schoolKey", name: "School",  type: "key" }
      });

      schoolKey.addClass("school")

      var roleKey = cy.add([
      {
        group: "nodes",
        data: { id: "schoolKey", name: "School",  type: "key" }
      },
      {
        group: "nodes",
        data: { id: "academicStaffKey", name: "Academic Staff",  role: "Academic staff", type: "key" }
      },
      {
        group: "nodes",
        data: { id: "honoursStudentKey", name: "Honours Student",  role: "Honours student", type: "key" }
      },
      {
        group: "nodes",
        data: { id: "phdStudentKey", name: "PhD Student",  role: "PhD student", type: "key" }
      },
      {
        group: "nodes",
        data: { id: "mastersStudentKey", name: "Masters Student",  role: "Masters student", type: "key" }
      },
      {
        group: "nodes",
        data: { id: "generalStaff", name: "General Staff",  role: "General staff", type: "key" }
      }
      ]);


      var keys = cy.elements('[type = "key"]');
      keys.unselectify().ungrabify();

      function arrange(){
        var maxLabelWidth = getMaxLabelWidth(keys);
        var nodeHeight = keys.height();
        var bboxIgnore = cy.elements('.hidden, .filtered, [type = "key"]');
        var bbox = cy.elements().not(bboxIgnore).boundingBox({ includeLabels : true});
        var keyNum = keys.size();
        var keysHeight = (nodeHeight*keyNum) + (keyYPadding*(keyNum-1));
        var layout = keys.layout({
          name: 'grid',
          columns: 1,
          boundingBox: { x1: bbox.x1 - (maxLabelWidth + keyXPadding), y1: bbox.y1 + ((bbox.h-keysHeight)/2), w: maxLabelWidth, h: keysHeight }
        });

        layout.run();
      }
      addKey.arrange = arrange;
    }

    function resizeIframe(){
    // Find all iframes
    var iFrames = $( "iframe" );
  // Find &#x26; save the aspect ratio for all iframes
  iFrames.each(function () {
    $( this ).data( "ratio", this.height / this.width )
    // Remove the hardcoded width &#x26; height attributes
    .removeAttr( "width" )
    .removeAttr( "height" );

  });

  // Resize the iframes when the window is resized

  iFrames.each( function() {
    // Get the parent container&#x27;s width
    var width = $( this ).parent().width();
    $( this ).width( width )
    .height( width * $( this ).data( "ratio" ) );
  });
// Resize to fix all iframes on page load.
$( this ).data( "ratio", this.height / this.width );
}

var getInitials = function (string, initNum, space) {
  var names = string.split(' ');
  var initials = names[0].substring(0, 1).toUpperCase();

  if(space == 1){
    var kerning = " ";
  }else{
    var kerning = "";
  }

  if(names.length > 2){
    for (var i = 1; i < names.length - 1; i++) {
      initials += kerning + names[i].substring(0, 1).toUpperCase();
    }
    
  }

  if (names.length > 1) {
    if(initNum == 1 || isNaN(names[names.length - 1]) == false){
      initials += kerning + names[names.length - 1];
    }else{
      initials += kerning + names[names.length - 1].substring(0, 1).toUpperCase();
    }
  }

  if(initNum == 0){
    initials = string;
  }

  return initials;
};

    function convertMedia(html){//https://stackoverflow.com/a/22667308
      var pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
      var pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
      var pattern3 = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png))/gi;

      if(pattern1.test(html)){
       var replacement = '<div class="media-wrapper"><iframe width="1920" height="1080" class="info-media" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
       var html = html.replace(pattern1, replacement);
       return html;
     }


     if(pattern2.test(html)){
      var replacement = '<div class="media-wrapper"><iframe width="1920" height="1080" class="info-media" src="http://www.youtube.com/embed/$1?&rel=0&showinfo=0&modestbranding=1&hd=1&autohide=1&color=white" frameborder="0" allowfullscreen></iframe></div>';
      var html = html.replace(pattern2, replacement);
      return html;
    } 


    if(pattern3.test(html)){
      var replacement = '<div class="media-wrapper"><a href="$1" target="_blank"><img class="img-fit" src="$1" /></a><br /></div>';
      var html = html.replace(pattern3, replacement);
      return html;
    }          
    
  }

      function populateHtml(node){
        var infoTitle = $("#toggle h");
        var infoContainer = $("#infoWrapper .info .container");

        infoContainer.html('');

        var mediaLink = node.data('mediaLink');
        var infoSchool = node.data('school');
        var siteLink = node.data('siteLink');
        var staffSiteLink = node.data('staffSiteLink');
        // var siteName = node.data('siteName');
        var siteName = node.data('name');
        var brief = node.data('brief');

  
  infoTitle.html(node.data('name'));


  

  if(node.data('type') == "person"){

    if(mediaLink){
    }else{
      mediaLink = 'assets/id-img.png';
    }

    if(staffSiteLink){
      var idHref = 'href="' + staffSiteLink + '"';
      console.log(staffSiteLink);
    }else{
      var idHref = '';
      console.log('else')
    }

      infoContainer.append('<div class="id-wrapper"><a ' + idHref + '" target="_blank"><div class="img-crop"><img src="' + mediaLink +'"></div></a></div>');
    

    infoContainer.append('<div class="info-row"><p class="info-left">Role |</p> <p class ="info-right">' +  node.data('role') + '</p></div>');
    
  }else{
    if(mediaLink){

    videoHtml = convertMedia(mediaLink);
    infoContainer.append(videoHtml);

    resizeIframe();
  }
  }
  if(infoSchool){
    infoContainer.append('<div class="info-row"><p class="info-left">Programme |</p> <p class ="info-right">' + infoSchool + '</p></div>');
  }

  if(siteLink){
    infoContainer.append('<div class="info-row"><p class="info-left">Website |</p> <a  target="_blank" class ="info-right" href="' + siteLink + '">' + siteName + '</a></div>');
  }

  if(brief){
    infoContainer.append('<div class="info-row"><hr><p class="info-brief">' + brief + '</p></div>');
  }

  function clearNav(){
    $("#toggle h").html('');
    infoContainer.html(infoString);
  }

  populateHtml.clearNav = clearNav;
}
   // rearranges node in concentric layout around highlighted node
   function highlight( node ){

      var nhood = node.closedNeighborhood(); //closedNeighborhood returns connected eles
      populateHtml(node);

      $('#infoContainer').waitForImages(function() {

      cy.batch(function(){ //batch processess multiple eles at once
        cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');
        nhood.removeClass('faded').addClass('highlighted');

        var npos = node.position();
        var w = cy.width();
        var h = cy.height();

        if($('#showInfo').prop('checked') == true){
          cy.maxZoom(100);

          var ogPan = Object.assign({}, cy.pan());
          var ogZoom = cy.zoom();
          
          cy.stop().fit(nhood, 0);   
          var fitZoom = cy.zoom();

          var nhoodHeight = nhood.renderedBoundingBox().h;
          var nhoodWidth = nhood.renderedBoundingBox().w;

          var nhoodRatio = nhoodHeight/nhoodWidth;


          var infoWidth = $('#infoContainer').width();
          var infoHeight = $('#infoContainer').height();
          var logoHeight = $("#header").height() + parseInt($("#header").css("bottom"), 10);
          var newWidth = w -  (infoWidth + layoutPadding*2);
          var newHeight = h - (infoHeight + layoutPadding + logoHeight);

          var leftRatio = h / newWidth;
          var bottomRatio = newHeight / w;
          var cyRatio = h/w;

          var panOffset = { x: 0, y: 0};
          console.log("| nhoodRatio =" + nhoodRatio + "| leftRatio =" + leftRatio + "| bottomRatio =" + bottomRatio + "| cyRatio =" + cyRatio)

          if(Math.abs(nhoodRatio - leftRatio) < Math.abs(nhoodRatio - bottomRatio)){

            if(nhoodRatio < leftRatio){
              var scaleFactor = newWidth/nhoodWidth;
              var newZoom = fitZoom * scaleFactor;
              console.log("left-width")
            }else{
              cy.stop().fit(nhood, layoutPadding);
              var newZoom = cy.zoom();
              console.log("left-height")

            }
            panOffset.x = -(infoWidth/2);
            panOffset.y = 0;
          }else{
            if(nhoodRatio > bottomRatio){

              if(nhoodRatio > cyRatio){
                var scaleFactor = newHeight/h;
                var newZoom = fitZoom * scaleFactor;
              }else{
                var scaleFactor = newHeight/nhoodHeight;
                var newZoom = fitZoom * scaleFactor;             
              }              
              
            }else{
              cy.stop().fit(nhood, layoutPadding);
              var newZoom = cy.zoom();
            }
            panOffset.x = 0;
            // panOffset.y = infoHeight/2 - logoHeight/2;
            panOffset.y = infoHeight/2;
          }

          console.log("| newZoom =" + newZoom);

          cy.zoom(newZoom);
          cy.center(nhood);
          var centerPan = Object.assign({}, cy.pan());

          cy.zoom(ogZoom);
          cy.pan(ogPan);
          cy.pan(centerPan);

          cy.stop().animate({ //frames all elements
            zoom : newZoom,
            pan: {x : centerPan.x+panOffset.x, y: centerPan.y+panOffset.y},
          }, {
            duration: layoutDuration
          })

          //cy.panBy({x : -(infoWidth/2), y: 0});

       // cy.maxZoom(maxZoom);
     }else{

         cy.stop().animate({ //frames all elements
          fit: {
            eles: nhood,
            padding: layoutPadding
          }
        }, {
          duration: layoutDuration
        })
       }


     });
    });
    }

    function clear(){//reset layout
     cy.elements().removeClass('highlighted').removeClass('faded');
     cy.animate({
      fit: {
        eles : cy.elements().not('.hidden, .filtered'),
        padding: layoutPadding
      }
    }, {
      duration: layoutDuration
    });
   }

   function clearStyles(){
    cy.elements().removeClass('filtered');
    cy.elements().removeClass('hidden');
    cy.elements().removeClass('highlighted');
    cy.edges().unselect();
  }

  function spreadProjects(node){
    nhoodProjects = node.closedNeighborhood().nodes('[type = "project"]');

    var nodeNum = nhoodProjects.size();

    nhoodProjects.forEach(function(n){
      var p = n.position();
      n.data('originPos', {
        x: p.x,
        y: p.y
      });
    });




      // var nodeCenter =  nhoodProjects.position();position()
      var nodeHeight = nhoodProjects.boundingBox().h;

      var nodesBBox =  cy.$(':selected').closedNeighborhood().not('.hidden, .filtered, [type = "project"]').boundingBox({ includeLabels : false});
      var peopleBBox = cy.nodes('[type = "person"]').boundingBox();

      var nodeCenter = { x : nodesBBox.x1 + (nodesBBox.w / 2 ), y : peopleBBox.y1 - (nodeHeight/2) - layoutPadding };

      
      var maxLabelWidth = getMaxLabelWidth(nhoodProjects);

      if(nodeNum > 1){
        var gridWidth = (maxLabelWidth*nodeNum) + layoutPadding * (nodeNum+1);
      }else{
        var gridWidth = maxLabelWidth;
      }
      console.log(" | nodesBBox.x1 = " + nodesBBox.x1 + " | nodeCenter.x = " + nodeCenter.x + " | gridWidth = " + gridWidth + " | nodesBBox.w = " + nodesBBox.w + " | nodesBBox midpoint = " + (nodesBBox.x1 + (nodesBBox.w / 2 )))

      var layout = nhoodProjects.layout({
        name: 'grid',
        columns: nodeNum,
        boundingBox: { x1: nodeCenter.x - gridWidth/2, y1: nodeCenter.y - nodeHeight, w: gridWidth, h: nodeHeight },
        avoidOverlap: true,
        avoidOverlapPadding: 10
      });

      layout.run();
      var projectMidpoint =  nhoodProjects.boundingBox({ includeLabels : false}).x1 + nhoodProjects.boundingBox({ includeLabels : false}).w/2;
      console.log(" | nhoodProjects.x1 = " + nhoodProjects.boundingBox({ includeLabels : false}).x1 + " | nhoodProjects.x2 = " + nhoodProjects.boundingBox({ includeLabels : false}).x2 + " | project midpoint = " + projectMidpoint);

    }

    function unspreadProjects(node){
      nhoodProjects = node.closedNeighborhood().nodes('[type = "project"]');
      var nodeNum = nhoodProjects.size();


      nhoodProjects.forEach(function(n){
        var position = n.data('originPos');
        n.position({ x: position.x, y : position.y});
      });

    }

    function circleRadius(collection, gaps){//works out radius for evenly spaced nodes along circumference of circle
      var circum = collection.size()*30+(collection.size()+gaps)*25;
      return circum/(2*Math.PI);
    }


    function drawProjects(){
      clearStyles();
      var elesHide = cy.elements('edge[type = "collab"], [type = "school"]');
      var elesFilter = cy.elements('edge[type = "collab"]');

      var activePeople = cy.nodes('[type = "project"]').closedNeighborhood();
      var nonActivePeople = cy.nodes('[type = "person"]').not( activePeople );
      elesFilter = elesFilter.add(nonActivePeople);

      elesHide.addClass('hidden');
      elesFilter.addClass('filtered');

      paddedHeight = cy.height()-layoutPadding*2

      if(cy.$(':selected').anySame(nonActivePeople) == true){
        cy.elements('[type = "school"]').addClass('filtered');
      // cy.$(':selected').removeClass('filtered').addClass('hidden')
    }

    var layout = cy.elements().layout({
      name: 'concentric',
      startAngle: 0,
      sweep: Math.PI,
      concentric: function(ele){
        if(ele.data('type') == "project"){
          return 1;
        } else if(cy.nodes('[type = "project"]').closedNeighborhood().contains(ele) != true){
         return 3;
       }else{
        return 2;
      }
    },
    levelWidth: function(){ return 1 },
    boundingBox : {
      x1 : 0,
      y1 : 0,
      w : 300,
      h: 300
    },
    avoidOverlap : false,
    equidistant: false,
     // spacingFActor : 0.5;
     padding: layoutPadding,
     minNodeSpacing: paddedHeight / 2 ,
     nodeDimensionsIncludeLabels: false,
   });

    layout.run();
    addKey.arrange();

    clear();
    cy.$(':selected').forEach(highlight);
    cy.fit(cy.elements().not('.hidden, .filtered'), layoutPadding);
  }

  function drawSchools(){
    clearStyles();
    var elesHide = cy.elements('edge[type = "collab"], [type = "project"]');
    var elesFilter = cy.elements('[type = "null"]');

    var schoolNodes = cy.nodes('[type = "school"]');
    var emptySchoolNodes = schoolNodes.filter(function( ele ){
      return ele.closedNeighborhood().nodes('[type = "person"]').size() < 1;
      console.log(ele.closedNeighborhood().nodes('[type = "person"]').size());
    });;
    





    


    schoolNodes = cy.nodes('[type = "school"]').not(emptySchoolNodes);


    var schoolNum = schoolNodes.size();

    elesFilter = elesFilter.add(emptySchoolNodes);

    elesHide.addClass('hidden');
    elesFilter.addClass('filtered');

    elesHide.position({
      x: cy.width()/2,
      y: -50,
    });

    

    var schoolColumns = Math.ceil(schoolNum/3);

    for(i = 2; i < 6; i ++){
      if(schoolNum % i < schoolNum % schoolColumns){
        schoolColumns = i;
      }else if(schoolNum % i == schoolNum % schoolColumns){
        if (i > schoolColumns) {
          schoolColumns = i;
        }

      }
    }
    var schoolRows = Math.floor(schoolNum/schoolColumns);

    var schoolBB = { w : 0, h : 0};
    var maxClusterSize = 0;

    function spreadSchools(){
      schoolBB.w = 0;
      schoolBB.h = 0;

      schoolNodes.forEach(function(ele){
        var node = ele;
        var nhood = node.closedNeighborhood();
        var npos = node.position();

        var radius = circleRadius(nhood.nodes('[type = "person"]'), 0);
        var minRad = 50;

        if(radius < minRad){
          radius = minRad;
        }

        var layout = nhood.nodes('[type = "person"]').layout({
          name: 'circle',
          avoidOverlap : false,
          padding: layoutPadding,
          boundingBox: {
            x1: npos.x - radius,
            y1: npos.y - radius,
            w: radius*2,
            h: radius*2,
          },
          radius: radius,
          nodeDimensionsIncludeLabels: false
        });
        layout.run();
        console.log(node.data('name') + ".radius = " + radius*2);
        var clusterSize = radius*2 + 30;
        if(maxClusterSize < clusterSize){
          maxClusterSize = clusterSize;
        }
      });
    }

      //var maxRowSize = 0;
      //var maxColSize = 0;


    //   for(i = 0; i < schoolRows; i++){

    //     var rowSize = 0;

    //     for(j = i*schoolColumns ; j < i*schoolColumns + schoolColumns && j < schoolNum; j++){
    //       rowSize += schoolNodes[j].closedNeighborhood().boundingBox().w;

    //     }

    //     if( rowSize > maxRowSize){
    //       maxRowSize = rowSize;
    //     }
    //   }

    //   for(i = 0; i < schoolColumns; i++){

    //     var colSize = 0;

    //     for(j = i ; j < schoolNum; j += schoolColumns){
    //       colSize += schoolNodes[j].closedNeighborhood().boundingBox().h;
    //       console.log(schoolNodes[j].data('name') + ".h = " + schoolNodes[j].closedNeighborhood().boundingBox().h);
    //     }

    //     if( colSize > maxColSize){
    //       maxColSize = colSize;
    //     }

    //   }

    //   schoolBB.w = maxRowSize;
    //   schoolBB.h = maxColSize;
    // }

    spreadSchools();

    var schoolWidth = maxClusterSize*(schoolColumns) + 40 + (schoolColumns-1)*layoutPadding;
    var schoolHeight = maxClusterSize*(schoolRows) + 40 + (schoolRows-1)*layoutPadding;


    console.log(schoolHeight);

    var schoolLayout = cy.elements('[type = "school"]').layout({
      name: 'grid',
      columns: schoolColumns,
      boundingBox: { x1: 0, y1: 0, w: schoolWidth , h: schoolHeight }
    })

    schoolLayout.run();

    spreadSchools();

    console.log(cy.nodes('[type = "school"]').boundingBox().h);

    addKey.arrange();
    clear();
    cy.$(':selected').forEach(highlight);
    cy.$(':selected').forEach(spreadProjects);
    cy.$(':selected').forEach(highlight);
  }

  function drawCollab(){
    clearStyles();
    var elesHide = cy.elements('[type = "project"], [type = "school"]');
    var elesFilter = cy.elements('[type = "project"]');

    var activePeople = cy.nodes('[type = "project"]').closedNeighborhood();
    var nonActivePeople = cy.nodes('[type = "person"]').not( activePeople );
    elesFilter = elesFilter.add(nonActivePeople);

    elesHide.addClass('hidden');
    elesFilter.addClass('filtered');

    var people = activePeople.nodes('[type = "person"]');


    var layout = people.layout({
      name: 'circle',
      avoidOverlap : false,
      padding: layoutPadding,
      radius: circleRadius(people, 0),
      nodeDimensionsIncludeLabels: false,
    });

    layout.run();

    cy.nodes().not(people).position({
      x: cy.width()/2,
      y: cy.height()/2,
    });

    addKey.arrange();
    clear();
    cy.$(':selected').forEach(highlight);
    cy.fit(cy.elements().not('.hidden, .filtered'), layoutPadding);
  }

  function addCollab(){
    cy.nodes('[type = "project"]').forEach(function(projectNode) {
      projectNode.closedNeighborhood().nodes('[type = "person"]').forEach(function(person){
        projectNode.closedNeighborhood().nodes('[type = "person"]').forEach(function(otherPerson){
          if(person != otherPerson && cy.edges('[id ="' +  person.id() + "to" + otherPerson.id() + '"]').size() < 1 && cy.edges('[id ="' +  otherPerson.id() + "to" + person.id() + '"]').size() < 1){
            cy.add({
              group: "edges",
              data: { id: person.id() + "to" + otherPerson.id(), source: person.id(), target: otherPerson.id(), type: "collab" }
            });
          }
        })
      })
    });
  }



  function initCy( then ){

    var loading = document.getElementById('loading');
    var elements = then[0]
    var styleJson = then[1];

    let defaultZoom = 1

    loading.classList.add('loaded');


    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      style: styleJson,
      elements: elements,
      motionBlur: true,
      selectionType: 'single',
      boxSelectionEnabled: false,
      wheelSensitivity: 0.5,
    })

    addCollab();
    addKey();

    cy.elements('[type = "school"]').addClass("school");
    cy.elements('[type = "project"]').addClass("project");

    cy.minZoom(0.2);
    cy.maxZoom(maxZoom);

    cy.on('select', 'node', function(e){

      var node = this;

      highlight( node );
      if ($('#showSchools').prop('checked') == true) {
        spreadProjects( node );
      }
      highlight( node );
      

    });

    cy.on('mouseover', 'node', function(e){
      var node = this;
      node.toggleClass('hover');
      $("#cy").css('cursor','pointer');

    });

    cy.on('mouseout', 'node', function(e){
      var node = this;
      node.toggleClass('hover');
      $("#cy").css('cursor','default');

    });

    cy.on('unselect', 'node', function(e){

      var node = this;

      if ($('#showSchools').prop('checked') == true) {
        unspreadProjects( node );
      }

      clear();
      populateHtml.clearNav();


    });
    function setInitials(ele, cutoff01, cutoff02, space){
      if( ele.data('name').length > cutoff01){
              var initNum = 1;
            if(space != 1){
              initNum = 2;
            }
            }else{
              var initNum = 0;
            }

            

            var nameShort = getInitials(ele.data('name'), initNum, space);

            if(nameShort.length > cutoff02){
               nameShort = getInitials(ele.data('name'), 2, space);
            }

            return nameShort
    }

    cy.on('zoom', function(event){

      cy.nodes('[type = "person"],[type = "project"],[type = "school"]').style({
        'label': function( ele ){ return ele.data('name')}
      })

      cy.nodes('[type = "project"]:unselected').style({
          'label': function( ele ){ return setInitials(ele, 15, 15, 2)}
        })

      cy.nodes('[type = "school"]:unselected').style({
          'label': function( ele ){ return setInitials(ele, 12, 12, 2)}
        })

      if(cy.zoom() < 1.2){

        cy.nodes('[type = "person"]:unselected').style({
          'label': function( ele ){ return setInitials(ele, 6, 6, 1)}
        })

      }else{
        cy.nodes('[type = "person"]:unselected').style({
          'label': function( ele ){ return setInitials(ele, 12, 12, 1)}
        })        
      }

      cy.nodes('.highlighted').style({
        'label': function( ele ){ return ele.data('name')}
      })


    });

    drawProjects();
  }

  $("#showProjects").on('change', function() {
    if($('#showCollab').prop('checked') == true || $('#showSchools').prop('checked') == true){
     drawProjects(); 
   }
   $('#showSchools').prop('checked', false);
   $('#showProjects').prop('checked', true);
   $('#showCollab').prop('checked', false);
 })




  $("#showSchools").on('change', function() {
    if($('#showProjects').prop('checked') == true || $('#showCollab').prop('checked') == true){
     drawSchools();
   }
   $('#showSchools').prop('checked', true);
   $('#showProjects').prop('checked', false);
   $('#showCollab').prop('checked', false);
 })

  $("#showCollab").on('change', function() {

    if($('#showProjects').prop('checked') == true || $('#showSchools').prop('checked') == true){
     drawCollab();
   }

   $('#showSchools').prop('checked', false);
   $('#showProjects').prop('checked', false);
   $('#showCollab').prop('checked', true);
 })

  $("#showInfo").on('change', function() {
    $("#infoWrapper").toggleClass("expanded");
    clear();
    cy.$(':selected').forEach(highlight);
  })

  $(window).on('resize', _.debounce(function () {
    cy.fit(cy.elements().not('.hidden, .filtered'), layoutPadding);
    clear();
    cy.$(':selected').forEach(highlight);
  }, 250));

});





