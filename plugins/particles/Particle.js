
Tiny.Particle = function( emitter, texture )
{
    Tiny.DisplayObject.call( this );

    this.parent = emitter

    this.anchor = new Tiny.Point()

    texture = texture || { valid: false }

    this.texture = texture

    this._frame = 0;

    this.lifespan = 0
};

Tiny.Particle.prototype = Object.create( Tiny.DisplayObject.prototype );
Tiny.Particle.prototype.constructor = Tiny.Particle;

Tiny.Particle.prototype.setTexture = function(texture)
{
    this.texture = texture;
};

Object.defineProperty(Tiny.Particle.prototype, 'frameName', {

    get: function() {
        return this.texture.frame.name
    },

    set: function(value) {
        if (this.texture.frame.name) {
            this.setTexture(Tiny.TextureCache[this.texture.key + "_" + value])
        }
    }

});

Object.defineProperty(Tiny.Particle.prototype, 'frame', {

    get: function() {
        return this._frame
    },

    set: function(value) {
        if (this.texture.max_no_frame) {
            this._frame = value
            if (this._frame > this.texture.max_no_frame)
                this._frame = 0
            this.setTexture(Tiny.TextureCache[this.texture.key + "_" + this._frame])
        }
    }

});


Tiny.Particle.prototype.drawTexture = function(renderSession)
{
    var dx = this.anchor.x * -this.texture.frame.width;
    var dy = this.anchor.y * -this.texture.frame.height;

    renderSession.context.drawImage(
                            this.texture.baseTexture.source,
                            this.texture.crop.x,
                            this.texture.crop.y,
                            this.texture.crop.width,
                            this.texture.crop.height,
                            dx / renderSession.resolution,
                            dy / renderSession.resolution,
                            this.texture.crop.width / renderSession.resolution,
                            this.texture.crop.height / renderSession.resolution);
};

Tiny.Particle.prototype.reset = function( x, y ) {

    this.x = x || 0
    this.y = y || 0

    this.alpha = 1;
    this.scale.set(1);
}

Tiny.Particle.prototype.update = function( time, delta ) {

}

Tiny.Particle.prototype.onEmit = function(  ) {

}

Tiny.Particle.prototype.draw = function(renderSession)
{

};

Tiny.Particle.prototype._update = function( time, delta ) {
    if (this.visible === false) return false

    this.lifespan -= delta;

    if (this.lifespan <= 0)
    {
        this.visible = false
        return false;
    }

    this.update( time, delta )

    this.updateTransform()

}

Tiny.Particle.prototype._renderCanvas = function(renderSession)
{
    if (this.visible === false || this.alpha === 0) return;

    renderSession.context.globalAlpha = this.worldAlpha;

    renderSession.context.setTransform(
                this.worldTransform.a,
                this.worldTransform.b,
                this.worldTransform.c,
                this.worldTransform.d,
                this.worldTransform.tx * renderSession.resolution,
                this.worldTransform.ty * renderSession.resolution);

    if ( this.texture.valid )
        this.drawTexture( renderSession )
    else
        this.draw( renderSession )
};