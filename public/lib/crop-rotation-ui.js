
var CropRotationUi = function (divSelector, options, onCropActivated) {

  var DEBUG = false
    , cropsWell = options.crops
    , rotationUi = $(divSelector)
    , MAX_ROTATION_LENGTH = options.maxRotationLength || 5
    , MAX_DROPS_PER_CROP = 3
    , MAX_DRAGS_PER_CROP = 3
    , MAX_CROPS_PER_YEAR = 3
    , MAX_CROPS_1ST_YEAR = 1
    , noYears = 1
    , colors = options.colors || 
      ['rgb(8,81,156)',
      'rgb(0,109,44)',
      'rgb(210, 210, 5)',
      'rgb(203, 24, 29)',
      'rgb(204, 76, 2)',
      'rgb(106, 81, 163)',
      'rgb(206, 18, 86)',
      'rgb(164, 46, 46)',
      'rgb(107,174,214)',
      'rgb(35,139,69)']
    , well = $('<div id="well"></div>').appendTo(rotationUi)
    , main = $('<div id="main"></div>').appendTo(rotationUi)
    , edit = $('<div id="edit"></div>').appendTo(rotationUi)
    , widthMain = 0
    , heightMain = 0
    , svg = null
    , previewConnection = null
    ;

  rotationUi.addClass('crop-rotation');

  var wellCrop, cropColor;
  for (var c = 0, cs = cropsWell.length; c < cs; c++) {
    var wellCrop = cropsWell[c];
    var cropColor = colors[c];
    $("<div class='well-item' data-crop='"+wellCrop.name+"'>\
        <div class='item-header'>\
          <span class='item-label'>"+wellCrop.name+"</span>\
          <span class='ui-icon ui-icon-close'></span>\
        </div>\
      </div>"
    ).appendTo(well).find('.item-header').css('background-color', cropColor + ' !important');
  }

  widthMain = parseInt(main.css('width'));
  heightMain = parseInt(main.css('height'));

  svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  svg.setAttributeNS(null, 'width', '100%');
  svg.setAttributeNS(null, 'height', '100%');
  svg.setAttributeNS(null, 'stroke-width', 0);
  svg.setAttributeNS(null, 'fill', '#333');
  main.append(svg);

  var connectorsG = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  connectorsG.setAttributeNS(null, 'id', 'connectors');
  svg.appendChild(connectorsG);

  var line;
  for (var y = 0; y < MAX_ROTATION_LENGTH; y++) {
    line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttributeNS(null, 'class', 'line-light');
    line.setAttributeNS(null, 'x1', (y + 1) * (widthMain - 2) / (MAX_ROTATION_LENGTH + 1));
    line.setAttributeNS(null, 'x2', (y + 1) * (widthMain - 2) / (MAX_ROTATION_LENGTH + 1));
    line.setAttributeNS(null, 'y1', 0);
    line.setAttributeNS(null, 'y2', heightMain);
    line.setAttributeNS(null, 'stroke-dasharray', '3,3');
    svg.appendChild(line);
  }

  previewConnection = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  previewConnection.setAttributeNS(null, 'class', 'preview');
  previewConnection.setAttributeNS(null, 'id', 'preview-connection');
  previewConnection.setAttributeNS(null, 'stroke-dasharray', '3,3');
  previewConnection.setAttributeNS(null, "d",'M 0 0 C 0 0 0 0 0 0');
  svg.appendChild(previewConnection);

  for (var y = 0; y < MAX_ROTATION_LENGTH; y++)
    main.append("<div class='crop-container'></div>");
  
  main.append("<div class='crop-container no-drop'></div>");
  
  $('.crop-container', main).css({
    width: (widthMain - 3) / (MAX_ROTATION_LENGTH + 1),
    height: heightMain
  });

  $(window).resize(function () {

    widthMain = parseInt(main.css('width'));
    heightMain = parseInt(main.css('height'));

    if (Math.floor((widthMain - 2) / (MAX_ROTATION_LENGTH + 1)) <= 85)
      return;
    
    $('.crop-container', main).css({
      width: Math.floor((widthMain - 2) / (MAX_ROTATION_LENGTH + 1)),
      height: heightMain
    });

    $('line', svg).each(function (index) {
      var line = $(this)[0];
      line.setAttributeNS(null, 'x1', (index + 1) * Math.floor((widthMain - 2) / (MAX_ROTATION_LENGTH + 1)));
      line.setAttributeNS(null, 'x2', (index + 1) * Math.floor((widthMain - 2) / (MAX_ROTATION_LENGTH + 1)));
    });

    $('.item', main).each(function (index) {
      $(this).css('left', (((widthMain - 2) / (MAX_ROTATION_LENGTH + 1)) - parseInt($(this).css('width'))) * 0.5);
    });

    connections.update();

  });


  /*
    allowed: n -> 1, 1 -> n
    not allowed: n -> n,m
  */

  var connections = (function (svg, connectorsG) {

    var store = [];

    var add = function (connection) {

      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
      path.setAttributeNS(null, 'class', 'connector');
      path.setAttributeNS(null, "d",'M0 0 C 0 0 0 0 0 0');
      connectorsG.appendChild(path);
      connection.path = path;
      store.push(connection);
      redraw(connection);

      return path;

    };

    var redraw = function (connection) {

      var path = connection.path
        , offsetFrom = connection.from.ui.offset()
        , offsetTo = connection.to.ui.offset()
        , ptFrom  = svg.createSVGPoint()
        , ptTo  = svg.createSVGPoint()
        , item0 = path.pathSegList.getItem(0)
        , item1 = path.pathSegList.getItem(1)
        ;

      ptFrom.x = offsetFrom.left + connection.from.ui.width();
      ptFrom.y = offsetFrom.top + connection.from.ui.height() * 0.5;
      ptFrom = ptFrom.matrixTransform(svg.getScreenCTM().inverse());

      ptTo.x = offsetTo.left;
      ptTo.y = offsetTo.top + connection.to.ui.height() * 0.5;
      ptTo = ptTo.matrixTransform(svg.getScreenCTM().inverse());

      item0.x = ptFrom.x;
      item0.y = ptFrom.y;
      item1.x = ptTo.x;
      item1.y = ptTo.y;
      item1.x1 = item1.x2 = ptFrom.x + (ptTo.x - ptFrom.x) * 0.5;      
      item1.y1 = ptFrom.y;
      item1.y2 = ptTo.y;
    
    };

    var update = function (item) {

      for (var i = 0, is = store.length; i < is; i++) {
        var connection = store[i];
        if (item === undefined) {
          redraw(connection); // update all items
        } else {
          if (connection.from.ui.parents('.item').is(item) || connection.to.ui.parents('.item').is(item))
            redraw(connection);
        }
      }

    };

    var remove = function (path) {

      if (!path) {
        clear();
      } else {

        for (var i = 0, is = store.length; i < is; i++) {

          if (store[i].path === path) {

            var connection = store.splice(i, 1)[0];
            $(connection.path).remove();
            if (store.length === is - 1)
              return connection;
            break;
          }

        }

        return null;
      
      }

    };

    var clear = function (path) {

      $(connectorsG).empty();
      store = [];

    };

    var get = function () {

      var rotation = [], from = null, to = null, containerIndex = 0;

      for (var i = 0, is = store.length; i < is; i++) {

        from = store[i].from.ui.parents('.item').data('data');
        to = store[i].to.ui.parents('.item').data('data');
        containerIndex = from.containerIndex;

        if (rotation[containerIndex] === undefined) {
          rotation[containerIndex] = [{
            crop: from.crop,
            id: from.id,
            to: [to.id]
          }];
        } else {
          var exists = rotation[containerIndex].filter(function (e) { return e.id === from.id; });
          if (exists[0]) {
            exists[0].to.push(to.id);
          } else {
            rotation[containerIndex].push({
              crop: from.crop,
              id: from.id,
              to: [to.id]
            });
          }
        }

      }

      return rotation;

    };


    return {
      get: get,
      add: add,
      update: update,
      remove: remove
    };


  }(svg, connectorsG));

  var updateRotationLength = function () {

    $('line', svg).each(function () { this.style.stroke = '#ccc'; });

    // find last container that is empty, contains no items
    var container = $('.crop-container', main);
    noYears = container.length - 1;
    for (var i = container.length - 2; i >= 0; i--) {
      if ($(container[i]).find('.item').length === 0)
        noYears = i;
      else
        break;
      $('line', svg)[i].style.stroke = '#eee';
    }

    if (DEBUG)
      console.log('updateRotationLength to: ' + noYears);

  };

  var itemDropAllowed = function (container, wellItem) {

    var containerIndex = $('.crop-container', main).index(container);

    if (containerIndex === MAX_ROTATION_LENGTH)
      return false;

    // only one item in first year allowed
    if (containerIndex === 0 && container.children('.item').length >= MAX_CROPS_1ST_YEAR)
      return false;

    // max 3 items per container
    if (containerIndex > 0 && container.children('.item').length >= MAX_CROPS_PER_YEAR)
      return false

    // if last crop (clone) has drops rotation length is locked
    var lastItem = $('.crop-container:last()', main).find('.item');
    if (containerIndex > 0 && lastItem.length > 0 && lastItem.data('data').drops.length > 0 && containerIndex + 1 > noYears)
      return false;

    // no perennials in first container
    if (containerIndex === 0 && wellItem.isPerennial)
      return false;

    // suggests to fill from 0 to x
    if (containerIndex > 0 && $($('.crop-container', main)[containerIndex - 1]).children('.item').length === 0)
      return false;

    return true;

  }; 

  var connectionAllowed = function (drag, drop) {

    var dragData = drag.parents('.item').data('data');
    var dropData = drop.parents('.item').data('data');

    if (dropData.crop.isPerennial && dropData.drops.length > 0 && hasPerennialPreCrop(drop.parents('.item')))
      return false;

    // avoid more than one perennial items as pre-crop or successive crop
    if (dragData.crop.name === dropData.crop.name && dropData.crop.isPerennial
      && (hasPerennialPreCrop(drop.parents('.item')) || hasPerennialSuccessiveCrop(drag.parents('.item'))))
      return false;

    // check if max. no. of precrops has been reached
    if (dropData.drops.length === MAX_DROPS_PER_CROP) {
      if (DEBUG) console.log('max. no. of precrops has been reached');
      return false;
    }

    // avoid n:m connections
    if (dropData.drops.length > 0 && dropData.drags.length > 1) {
      if (DEBUG) console.log('avoid n:m connections');
      return false;        
    }

    // allow only connections from previous period (container)
    if (dropData.containerIndex - 1 !== dragData.containerIndex) {

      // .. but allow if it is the last crop in a rotation
      if (dropData.containerIndex === $('.crop-container', main).length - 1)  { // is clone of first
        var index = dragData.containerIndex;
        var isLastCrop = true;
        while (index < $('.crop-container', main).length - 2) {

          index++;
          if ($($('.crop-container', main)[index]).children('.item').length !== 0) {
            isLastCrop = false;
            break;
          }

        };

        if (isLastCrop)
          return true;
      }

      if (DEBUG) console.log('only connections from previous period (container) allowed');
      return false;
    }

    var hasAlreadyConnectionToItem = false;
    var dragItem = drag.parents('.item');
    for (var i = 0, is = dropData.drops.length; i < is; i++) {
      if (dropData.drops[i].from.item.is(dragItem)) {
        hasAlreadyConnectionToItem = true;
        break;
      }
    }

    // check if drop is allowed
    if (hasAlreadyConnectionToItem) {
      if (DEBUG) console.log('items already connected')
      return false;
    }

    return true;

  };

  var updateArea = function (dragItem) {

    var area = 0;

    updateRotationLength();

    if (dragItem.data('data').containerIndex === noYears) {
      // compare start & end area
      area = dragItem.data('data').drops.reduce(function (p, c) {
        return p + c.area;
      }, 0);
      
      if (Math.round(area * 100) !== Math.round(dragItem.data('data').clone.data('data').crop.area * 100))
        dragItem.find('.item-area').css('color', 'red');
      else
        dragItem.find('.item-area').css('color', 'black');

      dragItem.find('.item-area').html(Math.round(area * 100) + '%');
      dragItem.data('data').crop.area = area;

      return;
    }

    if (dragItem.data('data').containerIndex === 0) {

      area = dragItem.data('data').crop.area;

    } else {

      area = dragItem.data('data').drops.reduce(function (p, c) {
        return p + c.area;
      }, 0);

      if (dragItem.data('data').drops.length === 0 || area === 0) {
        dragItem.find('.item-area').html(0 + '%');
        dragItem.find('.item-area').css('color', 'red');
        dragItem.data('data').crop.area = 0;
      } else {
        dragItem.find('.item-area').css('color', 'black');
      }

    }

    dragItem.find('.item-area').html(Math.round(area * 100) + '%');
    dragItem.data('data').crop.area = area;
    
    var draggedArea = area / dragItem.data('data').drags.length;

    for (var i = 0, is = dragItem.data('data').drags.length; i < is; i++) {

      var dropItem = dragItem.data('data').drags[i].to.item;

      if (dropItem.data('data').drops.length === 0 || area === 0) {
        dropItem.find('.item-area').html(0  + '%');
        dropItem.data('data').crop.area = 0;
        dropItem.find('.item-area').css('color', 'red');
      } else {
        dropItem.find('.item-area').css('color', 'black');
      }

      for (var j = 0, js = dropItem.data('data').drops.length; j < js; j++) {
      
        if (dropItem.data('data').drops[j].from.item.is(dragItem)) {
          dropItem.data('data').drops[j].area = draggedArea;
          dropItem.data('data').crop.area = dropItem.data('data').drops.reduce(function (p, c) {
              return p + c.area;
            }, 0);
          dropItem.find('.item-area').html(Math.round(dropItem.data('data').crop.area * 100) + '%');
        }
      
      }

      updateArea(dropItem);

    }

  };

  var makeConnection = function (drag, drop) {

    var path = connections.add({
      from: { ui: drag },
      to: { ui: drop }
    });

    drag.parents('.item').data('data').drags.push({
      path: path,
      area: 0,
      to: { item: drop.parents('.item'), drop: drop }
    });

    drop.parents('.item').data('data').drops.push({
      path: path,
      area: 0,
      from: { item: drag.parents('.item'), drag: drag }
    });

    updateArea(drag.parents('.item'));

    // if both crops are the same and prennial lock successive crop
    if (hasPerennialPreCrop(drop.parents('.item')))
      drop.parents('.item').addClass('locked');


    return path;

  };

  var hasPerennialPreCrop = function (item) {

    var itemData = item.data('data');
    
    if (itemData.crop.isPerennial
      && itemData.drops.filter(function (a) { return (a.from.item.data('data').crop.name === itemData.crop.name) }).length > 0)
      return true;

    return false;

  };

  var hasPerennialSuccessiveCrop = function (item) {

    var itemData = item.data('data');

    if (itemData.crop.isPerennial
      && itemData.drags.filter(function (a) { return (a.to.item.data('data').crop.name === itemData.crop.name) }).length > 0)
      return true;

    return false;

  };

  var makeDragableItem = function (item, containerIndex, position) {

    item.draggable({
      handle: '.item-header',
      containment: 'parent',
      create: function (event, ui) {

        item.data('data').containerIndex = containerIndex; // store containerIndex (index) of parent container
        if (containerIndex !== MAX_ROTATION_LENGTH && !item.data('data').id) /* do not overwrite id of clone or existing id (from setRotation) */
          item.data('data').id = Date.now();

        // leave item at position were it was dropped
        $(this).offset({ top: position.top, left: position.left});

        if (containerIndex === 0) { 

          // add a clone to last container to mirror (clone) item
          var clone = $(this).clone();
          /* both need to know about each other */
          $(this).data('data').clone = clone;
          // add clone to last container
          $('.crop-container.no-drop', main).append(clone);
          clone.addClass('is-clone');
          clone.data('data', {
            crop: { name: item.data('crop') },
            containerIndex: $('.crop-container', main).length - 1,
            drags: [],
            drops: [],
            clone: $(this),
            area: 0,
            id: item.data('data').id
          });
          makeDragableItem(clone, $('.crop-container', main).length - 1, $(this).position);
          addPrecrop($(this));

          // initial area
          var noCropsInFirstYear = $('.crop-container', main).first().find('.item').length;
          var area = 1 / (noCropsInFirstYear /** noYears*/);

          $('.crop-container', main).first().find('.item').each(function () { $(this).data('data').crop.area = area; });
          $('.crop-container', main).first().find('.item-area').html(Math.round(area * 100) + '%');
          $('.crop-container', main).first().find('.item').each(function () { updateArea($(this)); });

          // hide drag or drop in first (last) crop
          $(this).find('.item-drop').css('visibility', 'hidden');
          clone.find('.item-body-right').css('visibility', 'hidden');
          var cloneArea = clone.find('.item-area');
          cloneArea.html('0.00');
          cloneArea.css('color', 'red');

        } else {
          addPrecrop($(this));
        }
        

      },
      drag: function (event, ui) {

        // update svg paths
        connections.update($(this));
        // update clone position if item has clone
        var clone = $(this).data('data').clone;
        if (clone) {
          clone.css({ 'top': ui.position.top, 'left': ui.position.left });
          connections.update(clone);
        }

      },
      start: function (event, ui) {
        $(this).css('z-index', parseInt($(this).css('z-index')) + 1);
      },
      stop: function (event, ui) {
        $(this).css('z-index', parseInt($(this).css('z-index')) - 1);
      }
    });

    // close button TODO: hide close button in clone
    item.find('.item-header > .ui-icon-close').on('click', function () {

      var item = $(this).parents('.item');
      var containerIndex = item.data('data').containerIndex;

      if (containerIndex === MAX_ROTATION_LENGTH)
        return;
      var clone = item.data('data').clone;
      var connectedItems = [], connectedItem = null;

      if (item.data('data').drags.length === 0)
        item.addClass('no-successor');

      // remove connections to the left (drops)
      if (containerIndex > 0) {
        for (var i = 0, is = item.data('data').drops.length; i < is; i++) {

          connectedItem = item.data('data').drops[i].from.item;

          for (var j = 0, js = connectedItem.data('data').drags.length; j < js; j++) {
            
            if (connectedItem.data('data').drags[j].to.item.is(item)) {

              var connection = connections.remove(item.data('data').drops[i].path);
              if (connection) {
                connectedItem.data('data').drags.splice(j, 1);
                // recalculate splitted areas
                // if more than one connection ...
                if (connectedItem.data('data').drags.length > 0) {

                  $(connectedItem.find('.item-body-right')[j]).remove();
                  var height = connectedItem.find('.item-body').height();
                  var siblings = connectedItem.find('.item-body-right');
                  siblings.css('height', height / siblings.length);
                
                } /*else {
                  connectedItem.find('.item-body-right').removeClass('ui-icon ui-icon-close');
                }*/
                
              }
              
              connectedItems.push(connectedItem);
              break;

            }

          }

        }
        connections.update(); // update all
      }

      // remove connections to the right (drags)
      for (var i = 0, is = item.data('data').drags.length; i < is; i++) {

        connectedItem = item.data('data').drags[i].to.item;

        for (var j = 0, js = connectedItem.data('data').drops.length; j < js; j++) {
          
          if (connectedItem.data('data').drops[j].from.item.is(item)) {

            var connection = connections.remove(item.data('data').drags[i].path);
            if (connection) {
              connectedItem.data('data').drops.splice(j, 1);
              if (connectedItem.data('data').drops.length === 0)
                connectedItem.addClass('no-precrop');
            }

            connectedItems.push(connectedItem);
            break;
          }

        }


      }

      if (clone) {

        // remove connections to the left (drops)
        for (var i = 0, is = clone.data('data').drops.length; i < is; i++) {

          connectedItem = clone.data('data').drops[i].from.item;

          for (var j = 0, js = connectedItem.data('data').drags.length; j < js; j++) {
            
            if (connectedItem.data('data').drags[j].to.item.is(clone)) {

              var connection = connections.remove(clone.data('data').drops[i].path);
              if (connection) {
                connectedItem.data('data').drags.splice(j, 1);

                // recalculate splitted areas
                // if more than one connection ...
                if (connectedItem.data('data').drags.length > 0) {

                  $(connectedItem.find('.item-body-right')[j]).remove();
                  var height = connectedItem.find('.item-body').height();
                  var siblings = connectedItem.find('.item-body-right');
                  siblings.css('height', height / siblings.length);
                
                } /*else {
                  connectedItem.find('.item-body-right').removeClass('ui-icon ui-icon-close');
                }*/

              }

              connectedItems.push(connectedItem);
              break;
            
            }

          }

        }

        item.data('data').clone.remove();
      }

      item.remove();

      for (var i = 0, is = connectedItems.length; i < is; i++) {
        updateArea(connectedItems[i]);
        if (hasPerennialPreCrop(connectedItems[i]))
          connectedItems[i].addClass('locked');
        else
          connectedItems[i].removeClass('locked');

        if (connectedItems[i].data('data').drags.length === 0)
          connectedItems[i].addClass('no-successor');
      }

      updateRotationLength();

    });

    item.children('.item-body').on('click', function () {

      if (DEBUG)
        console.log($(this).parent('.item').data('data'));

      if ($(this).parent('.item').hasClass('locked') || $(this).parent('.item').hasClass('is-clone'))
        return;

      $('.item.active', main).removeClass('active');
      $(this).parent('.item').addClass('active');

      // load item data
      // $('#crop-name', edit).html($(this).parent('.item').data('data').crop.name);
      if (typeof onCropActivated === 'function')
        onCropActivated($(this).parent('.item').data('data').crop);

    });


  }; // make item

  var makeDragableConnector = function (drag, drop) {

    drag.draggable({
      helper: 'clone',
      zIndex: 2,
      containment: main,
      appendTo: main,
      create: function () {

        $(this).on('click', function (event) {

          event.stopPropagation();

          // remove a connection
          var dragItem = $(this).parents('.item');
          var dragData = dragItem.data('data');

          if (dragData.drags.length > 0) {

            var index = dragItem.find('.item-drag').index($(this));
            var connection = connections.remove(dragData.drags[index].path);
            if (connection) {
              var old = dragData.drags.splice(index, 1);
              var dropData = old[0].to.item.data('data');
              for (var i = 0, is = dropData.drops.length; i < is; i++) {
                if (dropData.drops[i].from.item.is(dragItem)) {
                  dropData.drops.splice(i, 1);
                  if (dropData.drops.length === 0)
                    old[0].to.item.addClass('no-precrop');
                  break;
                }
              } 

              updateArea(old[0].to.item);  

              // if more than one connection ...
              if (dragData.drags.length > 0) {

                var height = $(this).parents('.item-body').height();
                var siblings = $(this).parent().siblings('.item-body-right');
                siblings.css('height', height / siblings.length);
                $(this).parents('.item-body-right').remove();
                connections.update($(siblings[0]).parents('.item'));
              
              } /*else {
                $(this).children('span').removeClass('ui-icon ui-icon-close');
              }*/

              updateArea(dragItem);
              
              if (!hasPerennialPreCrop(old[0].to.item))
                old[0].to.item.removeClass('locked');

              if (dragItem.data('data').drags.length === 0)
                dragItem.addClass('no-successor');     

            }
          }
        }); // on click

        $(this).on('mouseover', function () {

          var dragItem = $(this).parents('.item');
          var drags = dragItem.data('data').drags;

          if (drags.length > 0) {
            var index = dragItem.find('.item-drag').index($(this));
            drags[index].path.setAttributeNS(null, 'class', 'connector dot');
          }          

        }); // on mouseover

        $(this).on('mouseout', function () {

          var dragItem = $(this).parents('.item');
          var drags = dragItem.data('data').drags;

          if (drags.length > 0) {
            var index = dragItem.find('.item-drag').index($(this));
            drags[index].path.setAttributeNS(null, 'class', 'connector');
          }          

        }); // on mouseover

        if (drop) {

          var path = makeConnection(drag, drop);
          // $(this).children('span').addClass('ui-icon ui-icon-close');   
          connections.update($(this).parents('.item'));      

        }
      
      }, // create
      start: function (event, ui) {

        var item = $(this).parents('.item');

        // check if max. no. of precrops has been reached
        if (item.data('data').drags.length === MAX_DRAGS_PER_CROP) {
          if (DEBUG) console.log('max. no. of drags has been reached');
          return false;
        }

        // avoid n:m connections
        if (item.data('data').drops.length > 1 && item.data('data').drags.length > 0) {
          if (DEBUG) console.log('avoid n:m connections');
          return false;        
        }

        // move active connection above items TODO: move previewConnection to seperate svg
        $(svg).css('z-index', 3);
        previewConnection.style.opacity = 1;

      }, // start
      stop: function (event, ui) {

        previewConnection.style.opacity = 0;
        previewConnection.setAttributeNS(null, 'class', 'preview');
        // move active connection below items
        $(svg).css('z-index', 1);

      }, // stop
      drag: function (event, ui) {

        var offsetFrom = $(this).offset()
          , offsetTo = ui.offset
          , ptFrom  = svg.createSVGPoint()
          , ptTo  = svg.createSVGPoint()
          , item0 = previewConnection.pathSegList.getItem(0)
          , item1 = previewConnection.pathSegList.getItem(1)

        ptFrom.x = offsetFrom.left + $(this).width() * 0.5;
        ptFrom.y = offsetFrom.top + $(this).height() * 0.5;
        ptFrom = ptFrom.matrixTransform(svg.getScreenCTM().inverse());

        ptTo.x = offsetTo.left + ui.helper.width() * 0.5;
        ptTo.y = offsetTo.top + ui.helper.height() * 0.5;
        ptTo = ptTo.matrixTransform(svg.getScreenCTM().inverse());

        item0.x = ptFrom.x;
        item0.y = ptFrom.y;
        item1.x = ptTo.x;
        item1.y = ptTo.y;
        item1.x1 = item1.x2 = ptFrom.x + (ptTo.x - ptFrom.x) * 0.5;      
        item1.y1 = ptFrom.y;
        item1.y2 = ptTo.y;

      } // drag
    }); // draggable

  }; // makeDragableConnector


  var addPrecrop = function (item) {

    item.append(
      "<div class='item-body'>\
        <div class='item-body-left'>\
          <div class='item-drop'></div>\
        </div>\
        <div class='item-body-right'>\
          <span class='item-drag-area'>1</span>\
          <div class='item-drag'><span></span></div>\
        </div>\
        <span class='item-area'></span>\
      </div>");

    makeDragableConnector($(item.find('.item-drag').last()));
    
    // create droppable in new crop area
    $('.item-drop', item).droppable({
      accept: '.item-drag', 
      tolerance: 'touch',
      create: function () {

      }, // create
      over: function (event, ui) {

        if (connectionAllowed(ui.draggable, $(this))) {

          $(this).addClass('over-allowed');
          $(this).removeClass('over-not-allowed');
          ui.draggable.addClass('over-allowed');
          ui.draggable.removeClass('over-not-allowed');
          previewConnection.setAttributeNS(null, 'class', 'over-allowed');

        } else {
          
          $(this).addClass('over-not-allowed');
          $(this).removeClass('over-allowed');
          ui.draggable.addClass('over-not-allowed');
          ui.draggable.removeClass('over-allowed');
          previewConnection.setAttributeNS(null, 'class', 'over-not-allowed');
        }

      }, // over
      out: function (event, ui) {

        $(this).removeClass('over-allowed over-not-allowed');
        ui.draggable.removeClass('over-allowed over-not-allowed');
        previewConnection.setAttributeNS(null, 'class', 'preview');

      }, // out
      drop: function (event, ui) {

        var drag = ui.draggable;
        var drop = $(this);

        drop.removeClass('over-allowed over-not-allowed');
        drag.removeClass('over-allowed over-not-allowed');
        previewConnection.setAttributeNS(null, 'class', 'preview');
        
        if (!connectionAllowed(drag, drop))
          return false;

        drop.parents('.item').removeClass('no-precrop');
        drag.parents('.item').removeClass('no-successor');

        if (drag.parents('.item').data('data').drags.length > 0) {

          var pre = drag.parents('.item-body');
          var noDrags = drag.parents('.item').data('data').drags.length;

          if (pre.find('.item-body-right').length < MAX_DRAGS_PER_CROP) {
            
            pre.append(
              "<div class='item-body-right'>\
                <span class='item-drag-area'>0</span>\
                <div class='item-drag'><span></span></div>\
              </div>"
            );

            pre.find('.item-drag-area').html((1 / (noDrags + 1)).toFixed(2));

            // TODO: layout
            drag.parents('.item-body').find('.item-body-right').css('height', pre.height() / (noDrags + 1));
            drag.parent().css('height', (pre.height() - $('.item-body-right').css('border-top-width') * 2 * (noDrags + 1)) / (noDrags + 1));
            makeDragableConnector($(pre.find('.item-drag').last()), drop);

            // update clone if there is any
            var clone = drop.parents('.item').data('data').clone;
            if (clone) {
              if (clone.data('data').containerIndex === 0) {

                clone.data('data').drops = drop.parents('.item').data('data').drops;              

              }
            }

          }

        } else {

          var path = makeConnection(drag, drop);

          // update clone if there is any
          var clone = drop.parents('.item').data('clone');
          if (clone) {
            if (clone.data('data').containerIndex === 0) {

              clone.data('data').drops = drop.parents('.item').data('data').drops;

            }
          }
        }
      } // drop
    }); // droppable
  }; // addPrecrop

  // item well
  $('.well-item', well).draggable({
    helper: 'clone',
    appendTo: rotationUi,
    start: function(event, ui) {
      $(ui.helper).addClass("well-item-helper");
    }
  });

  // container 
  $('.crop-container', main).droppable({
    tolerance: 'fit',
    accept: '.well-item',
    create: function (event, ui) {
      // $(this).data('crops', []);
    },
    over: function (event, ui) {

      if (!itemDropAllowed($(this), cropsWell.filter(function (a) { return a.name === $(ui.draggable).data('crop'); })[0]))
        $(ui.helper).switchClass('is-droppable', 'not-droppable');
      else
        $(ui.helper).switchClass('not-droppable', 'is-droppable');


    },
    out: function (event, ui) {

    },
    drop: function (event, ui) {

      if (!itemDropAllowed($(this), cropsWell.filter(function (a) { return a.name === $(ui.draggable).data('crop'); })[0]))
        return false;

      var containerIndex = $('.crop-container', main).index($(this));
      var item = $(ui.draggable).clone();
      
      item.switchClass('well-item', 'item');
      item.addClass('no-precrop no-successor');
      var data = {
        crop: JSON.parse(JSON.stringify(cropsWell.filter(function (a) { return a.name === item.data('crop'); })[0])),
        containerIndex: containerIndex,
        drags: [],
        drops: [],
        clone: null,
        area: containerIndex === 0 ? 1 : 0
      };

      item.data('data', data);
      item.appendTo(this);
      makeDragableItem(item, containerIndex, ui.offset);
      item.css('left', ((widthMain / (MAX_ROTATION_LENGTH + 1)) - parseInt(item.css('width'))) * 0.5);
      if (parseInt(item.css('top')) + parseInt(item.css('height')) > heightMain)
        item.css('top', heightMain - parseInt(item.css('height')));

      // update length of rotation
      updateRotationLength();

    }
  });

  var rotation = function () {

    var rotation = connections.get();
    if (DEBUG) console.log(JSON.stringify(rotation, null, 2));
    return rotation;

  };

  var removeRotation = function () {

    connections.remove();
    $('.item', main).remove();

  };

  var setRotation = function (rotation) {

    removeRotation();

    function addCrop(containerIndex, crop, id) {

      var item = $(
        "<div class='item no-precrop no-successor' data-crop='"+crop.name+"'>\
          <div class='item-header'>\
            <span class='item-label'>"+crop.name+"</span>\
            <span class='ui-icon ui-icon-close'></span>\
          </div>\
        </div>"
      ).appendTo('.crop-container:eq('+containerIndex+')', main);

      var color = $('div[data-crop="'+crop.name+'"]', '#well').children('.item-header').css('background-color');
      $('.item-header', item).css('background-color', color);

      var data = {
        crop: crop,
        containerIndex: containerIndex,
        drags: [],
        drops: [],
        clone: null,
        area: 0,
        id: id 
      };

      item.data('data', data);
      var left = ((widthMain / (MAX_ROTATION_LENGTH + 1)) - parseInt(item.css('width'))) * 0.5;
      var top = 5 + (parseInt(item.css('height')) + 5) * ($('.crop-container:eq('+containerIndex+')', main).children('.item').length - 1);
      item.css('left', left);
      item.css('top', top);
      makeDragableItem(item, containerIndex, 0);
      updateRotationLength();
      
      return item;

    }

    function addConnection(from, to) {

      var drop = to.find('.item-drop.ui-droppable');
      var drag = from.find('.item-drag.ui-draggable.ui-draggable-handle');

      if (!connectionAllowed(drag, drop))
        return;

      drop.parents('.item').removeClass('no-precrop');
      drag.parents('.item').removeClass('no-successor');
      
      if (from.data('data').drags.length > 0) {

        var pre = drag.parents('.item-body');
        var noDrags = drag.parents('.item').data('data').drags.length;

        if (pre.find('.item-body-right').length < MAX_DRAGS_PER_CROP) {
          
          pre.append(
            "<div class='item-body-right'>\
              <span class='item-drag-area'>0</span>\
              <div class='item-drag'><span></span></div>\
            </div>"
          );

          pre.find('.item-drag-area').html((1 / (noDrags + 1)).toFixed(2));

          drag.parents('.item-body').find('.item-body-right').css('height', pre.height() / (noDrags + 1));
          drag.parent().css('height', (pre.height() - $('.item-body-right', from).css('border-top-width') * 2 * (noDrags + 1)) / (noDrags + 1));
          makeDragableConnector($(pre.find('.item-drag').last()), drop);

          // update clone if there is any
          var clone = drop.parents('.item').data('data').clone;
          if (clone) {
            if (clone.data('data').containerIndex === 0)
              clone.data('data').drops = drop.parents('.item').data('data').drops;
          }

        }

      } else {
        makeConnection(drag, drop);
      }

    }

    var crops, crop, connect = [], years = rotation.length;

    for (var y = 0; y < years; y++) {

      crops = rotation[y];

      for (var c = 0, cs = crops.length; c < cs; c++) {

        crop = crops[c].crop;

        // extend with parameters
        if (!crop.hasOwnProperty('parameter')) 
          crop.parameter = {};

        var proto = JSON.parse(JSON.stringify(cropsWell.filter(function (a) { return a.name === crop.name; })[0]));

        crop = $.extend(true /*deep*/, proto, crop); // do not overwrite obj provided in rotation, instead overwrite proto

        var item = addCrop(y, crop, crop.id);
        connect.push({
          item: item,
          crop: crops[c],
          year: y
        });

      }

    }

    for (var i = 0, is = connect.length; i < is; i++) {

      for (var j = 0, js = connect[i].crop.to.length; j < js; j++) {

        if (connect[i].year === years - 1) { // last year: connect to clone
          var to = connect.filter(function (ele, index) {
            return (connect[i].crop.to[j] === ele.crop.id);
          });
          if (to.length > 0)
            addConnection(connect[i].item, to[0].item.data('data').clone);
        } else {
          var to = connect.filter(function (ele, index) {
            return (index > i && connect[i].crop.to[j] === ele.crop.id);
          });
          if (to.length > 0)
            addConnection(connect[i].item, to[0].item);
        }

      }

    }

    if (years > 0) {
      var first = $('.item', main).first();
      first.addClass('active');
      onCropActivated(first.data('data').crop);
    }

  };


  var rotationIsValid = function () {

    var valid = true;

    $('.crop-container').first().children('.item').each(function () {
      if (Math.abs($(this).data('data').crop.area - $(this).data('data').clone.data('data').crop.area) > 0.01)
        valid = false
    });

    return valid;

  };


  var splitted = function () {

    var rotation_ = rotation(),
        splitted = [];

    if (!rotationIsValid())
      return splitted;

    function getElement(idx, id) {
      return rotation_[idx].filter(function (a) {
        return a.id === id;
      });
    }

    function addChildren(idx, parent, rotation) {
      if (idx + 1 > rotation_.length - 1)
        return;

      if (parent.to.length > 1) {
        throw new Error(parent);
      }

      var child = getElement(idx + 1 > rotation_.length - 1 ? 0 : idx + 1, parent.to[0]);
      var to = JSON.parse(JSON.stringify(child[0].to));
      child[0].to = [to[0]];
      rotation.push(child[0]);
      for (var l = 1; l < to.length; l++) {
        var copy = JSON.parse(JSON.stringify(rotation));
        copy[copy.length - 1].to = [to[l]];
        var len = splitted.push(copy);
        addChildren(idx + 1, copy[copy.length - 1], splitted[len - 1]);
      }
      addChildren(idx + 1, child[0], rotation);

    }

    for (var i = 0; i < rotation_[0].length; i++) {
      var element = rotation_[0][i];
      var to = JSON.parse(JSON.stringify(element.to));
      for (var l = 0; l < to.length; l++) {
        var copy = JSON.parse(JSON.stringify(element));
        copy.to = [to[l]];
        var r = [copy];
        splitted.push(r);
        addChildren(0, copy, r);
      }
    }

    return splitted;

  };


  return {
    rotation: rotation,
    splitted: splitted,
    setRotation: setRotation,
    rotationLength: function () {
      return noYears;
    },
    rotationIsValid: rotationIsValid
  };

};
