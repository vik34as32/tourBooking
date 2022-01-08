const mongoose = require( 'mongoose');
const slugify = require('slugify');
const User =require('./UserModels')

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A Tour must have a name'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour name have less and equal then 40 chararcters'],
        min:[10,'A tour name have greater and equal then 10 chararcters'],
    },
    slug: String,
    duration:{
        type:Number,
        required:[true,'A tour must have duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have w group size']
    },
    difficulty:{
        type:String,
        required:[true, 'A tour should have dificulties'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficulty'
          }
      
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be above 5.0'],
         set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must have price']
    },
    priceDiscount: {
        type: Number,
        validate: {
          validator: function(value) {
            // this only points to current doc on NEW documnet creation
            return value < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        }
      },
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have summary']
    },
    description:{
        type:String,
        trim:true,
        required:[true, 'A tour must have description']
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have imageCover']
    },
    images:[String],
    createdate:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],  
    secretTour: {
      type: Boolean,
      default: false
    },
    startlocation:[
        {
        type:{ 
          type:String,  
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
      }
    ],
     Location:[
         {
        type:{ 
            type:String,  
            default:'Point',
            enum:['Point']
          },
          coordinates:[Number],
          address:String,
          description:String,
          day:Number
        }
    ],
     quides:[
         {
             type:mongoose.Schema.ObjectId,
             ref:'User'
         }
     ]
    

},

 {
     toJSON:{virtuals:true},
     toObject:{virtuals:true}
 }
)

//thsis schema searchig ot more data ecause the thousad of data to search to hume data search 1000 data lane ahut time lageda isliye hum index
//use krte k taki hum jitna data search kre utna hi data aaye
tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({slug:1})

tourSchema.index({startlocation:'2dsphere'})

tourSchema.virtual('durationWeeks').get(function() {
      return this.duration / 7+" " + "Weeks";
 })


tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

 tourSchema.pre(/^find/, function(next) {
     this.find({ secretTour: { $ne: true } });
  
     this.start = Date.now();
     next();
   });
  
  // tourSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'guides',
  //     select: '-__v -passwordChangedAt'
  //   });
  
  //    next();
  //  });

const Tour = mongoose.model('Tour',tourSchema);
  
module.exports =Tour