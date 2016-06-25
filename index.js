var circleArr = [];
var boxArr = [];
var container;
var world = null;
var renderers;
var stage;
var pondContainer;
var timeStep = 1.0 / 60.0;
var velocityIterations = 8;
var positionIterations = 3;
var g_groundBody = null;
var test;
var bodyArr = [];
var stats;
var METER = 100;
var SCALE = 1;
var windowWidth = window.innerWidth - 10;
var windowHeight = window.innerHeight - 10;
var OFFSET_X = 0;
var OFFSET_Y = 0 ;
function testSwitch(testName) {
    world.SetGravity(new b2Vec2(0, 10));
    var bd = new b2BodyDef;
    g_groundBody = world.CreateBody(bd);
    test = new window[testName];
}
function animate() {
    world.Step(timeStep, velocityIterations, positionIterations);
    var particles = world.particleSystems[0].GetPositionBuffer();
    for (var i = 0; i < circleArr.length; i++) {
        circleArr[i].x = particles[i * 2] * METER + OFFSET_X;
        circleArr[i].y = particles[(i * 2) + 1] * METER + OFFSET_Y;
    };
	for (i = 0, max = world.bodies.length; i < max; i++) {
        drawBody(world.bodies[i]);
    }
    window.requestAnimationFrame(animate);
    renderers.render(stage);
}
function drawBody(body) {
    var maxFixtures = body.fixtures.length;
    var transform = body.GetTransform();
    for (var j = 0; j < maxFixtures; j++) {
        var fixture = body.fixtures[j];
        defineFixture(fixture, transform,j);
        //ctx.strokeStyle = "white";
        //ctx.stroke();
    }
}
function defineFixture(fixture, transform,index) {
	//if(fixture.density!=1){
		//return;
	//}
    var shape = fixture.shape;
    if (shape instanceof b2PolygonShape) {
        definePolygon(fixture, transform,index);
    } /*else if (shape instanceof b2CircleShape) {
        defineCircle(shape, transform);
    } else if (shape instanceof b2EdgeShape) {
        defineEdge(shape, transform);
    }
	*/
}
function definePolygon(fixture, transform,index) {

		boxArr[index].x=transform.p.x* METER + OFFSET_X;
		boxArr[index].y=transform.p.y* METER + OFFSET_Y;
		//boxArr[index].rotation = transform.q.s;
		boxArr[index].rotation =fixture.body.GetAngle();
	
    /*ctx.beginPath();
    for (var i = 0, max = shape.vertices.length; i < max; i++) {
        var v = new b2Vec2();
        b2Vec2.Mul(v, transform, shape.vertices[i]);
		
        if (i == 0) {
            ctx.moveTo(v.x * drawScale, v.y * drawScale);
        } else {
            ctx.lineTo(v.x * drawScale, v.y * drawScale);
        }
		
		//console.log(i,v.x,v.y);
    }
    //ctx.closePath();
	*/
}
function TestWaveMachine() {
    var bdDef = new b2BodyDef();
    var bobo = world.CreateBody(bdDef);
    var wg = new b2PolygonShape();
    wg.SetAsBoxXYCenterAngle(
        windowWidth / METER / 2,
        0.05,
        new b2Vec2(windowWidth / METER / 2, windowHeight / METER + 0.05),
        0
    );
    bobo.CreateFixtureFromShape(wg, 5);
    var wgl = new b2PolygonShape(); 
    wgl.SetAsBoxXYCenterAngle(
        0.05,
        windowHeight / METER / 2,
        new b2Vec2(-0.05, windowHeight / METER / 2),
        0
    );
    bobo.CreateFixtureFromShape(wgl, 5);
    var wgr = new b2PolygonShape();
    wgr.SetAsBoxXYCenterAngle(
        0.05,
        windowHeight / METER / 2,
        new b2Vec2(windowWidth / METER + 0.05,
        windowHeight / METER / 2),
        0
    );
    bobo.CreateFixtureFromShape(wgr, 5);
    var psd = new b2ParticleSystemDef();
    psd.radius = 0.025;
    psd.dampingStrength = 0.2;
    var particleSystem = world.CreateParticleSystem(psd);
    var box = new b2PolygonShape();
    box.SetAsBoxXYCenterAngle(
        1, 
        2, 
        new b2Vec2(windowWidth / 2 / METER, -windowHeight / 4 / METER), 
        0
    );
    var particleGroupDef = new b2ParticleGroupDef();
    particleGroupDef.shape = box;
    var particleGroup = particleSystem.CreateParticleGroup(particleGroupDef);
	console.log(world.particleSystems[0].GetPositionBuffer().length / 2);
	createBox(3, 3, 75, 1.5, 0.5,b2_dynamicBody,1);
}
function createBox(x, y, angle, w, h, type, density) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = type || b2_staticBody;
    bodyDef.position.Set(x, y);
    bodyDef.angle = Math.PI / 180 * angle;
	
    var body = world.CreateBody(bodyDef);
    var shape = new b2PolygonShape();
    shape.SetAsBoxXY(w * 0.5, h * 0.5);
    body.CreateFixtureFromShape(shape, density || 0);
}
TestWaveMachine.prototype.Step = function() {
    world.Step(timeStep, velocityIterations, positionIterations);
    this.time += 1 / 60;
}
function init() {
    stage = new PIXI.Stage(0x66FF99);
    pondContainer = new PIXI.Container();
    boxContainer = new PIXI.Container();
    stage.addChild(pondContainer);
    stage.addChild(boxContainer);
    renderers = PIXI.autoDetectRenderer(window.innerWidth - 10, window.innerHeight -10, null, true, false); 
    document.body.appendChild(renderers.view);
    testSwitch("TestWaveMachine");
    var _len = world.particleSystems[0].GetPositionBuffer().length / 2;
    for (var i = 0; i < _len; i++) {
        var tempBall = new PIXI.Sprite.fromImage("x31yT.png");
        tempBall.anchor.x = 0.5;
        tempBall.anchor.y = 0.5;
        tempBall.scale.x = 0.3;
        tempBall.scale.y = 0.3;
        tempBall.alpha = 1.0;
        circleArr.push(tempBall);
        pondContainer.addChild(tempBall);
    };
	//
	for (i = 0, max = world.bodies.length; i < max; i++) {
       // var body = world.bodies[i];
		var tempBox = new PIXI.Sprite.fromImage("box.png");
        tempBox.anchor.x = 0.5;
        tempBox.anchor.y = 0.5;
        tempBox.scale.x = 1;
        tempBox.scale.y = 1;
        tempBox.alpha = 1.0;
        boxArr.push(tempBox);
        boxContainer.addChild(tempBox);
    }
	//
	
	//boxContainer
    window.requestAnimationFrame(animate);
}
function onload() {
    var gravity = new b2Vec2(0, 10);
    world = new b2World(gravity);
    init();
	var that = this;
	document.addEventListener('mousedown', function(event) {
		
		var p = getMouseCoords(event);

		var aabb = new b2AABB;

		aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
		aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);

		var queryCallback = new QueryCallback(p);
		world.QueryAABB(queryCallback, aabb);

		if (queryCallback.fixture) {
		  var body = queryCallback.fixture.body;
		  var md = new b2MouseJointDef;
		  md.bodyA = g_groundBody;
		  md.bodyB = body;
		  md.target = p;
		  md.maxForce = 1000 * body.GetMass();
		  that.mouseJoint = world.CreateJoint(md);
		  body.SetAwake(true);
		}
	});
	  document.addEventListener('mousemove', function(event) {
		var p = getMouseCoords(event);
		if (that.mouseJoint) {
		  that.mouseJoint.SetTarget(p);
		}
		if (test.MouseMove !== undefined) {
		  test.MouseMove(p);
		}
	  });

	  document.addEventListener('mouseup', function(event) {
		if (that.mouseJoint) {
		  world.DestroyJoint(that.mouseJoint);
		  that.mouseJoint = null;
		}
		if (test.MouseUp !== undefined) {
		  test.MouseUp(getMouseCoords(event));
		}
	  });
}
/**@constructor*/
function QueryCallback(point) {
  this.point = point;
  this.fixture = null;
}

/**@return bool*/
QueryCallback.prototype.ReportFixture = function(fixture) {
  var body = fixture.body;
  if (body.GetType() === b2_dynamicBody) {
    var inside = fixture.TestPoint(this.point);
    if (inside) {
      this.fixture = fixture;
      return true;
    }
  }
  return false;
};

function getMouseCoords(event) {
  var p = new b2Vec2(((event.clientX) / METER ), ((event.clientY) / METER  ));
//  console.log(p);
  return p;
}

onload();
