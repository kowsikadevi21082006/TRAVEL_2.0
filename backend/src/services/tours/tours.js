// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  toursDataValidator,
  toursPatchValidator,
  toursQueryValidator,
  toursResolver,
  toursExternalResolver,
  toursDataResolver,
  toursPatchResolver,
  toursQueryResolver
} from './tours.schema.js'
import { ToursService, getOptions } from './tours.class.js'
import { toursPath, toursMethods } from './tours.shared.js'

export * from './tours.class.js'
export * from './tours.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const tours = (app) => {
  // Register our service on the Feathers application
  app.use(toursPath, new ToursService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: toursMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(toursPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(toursExternalResolver), schemaHooks.resolveResult(toursResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(toursQueryValidator), schemaHooks.resolveQuery(toursQueryResolver)],
      find: [ filterByLocation],
      get: [],
      create: [schemaHooks.validateData(toursDataValidator), schemaHooks.resolveData(toursDataResolver)],
      patch: [schemaHooks.validateData(toursPatchValidator), schemaHooks.resolveData(toursPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      find: [addReviewSummary],
      get: [addReviewSummary]
    },
    error: {
      all: []
    }
  })


  async function addReviewSummary(context) {

    async function computeReviewStats(tourId){
      const reviewData = await context.app.service("reviews").find({
        query:{
          tourId
        }
      }) 

      let tempTotal = 0
      reviewData.data.forEach(review => {
        tempTotal += review.reviewRating
      });    
      const avgRatings = reviewData.total!=0 ? parseFloat(tempTotal / reviewData.total).toFixed(1) : 0

      return {
        totalReviews: reviewData.total,
        avgRatings
      }
    }

    if (context.id) {
      context.result.reviewStats = await computeReviewStats(context.id)
    } 
    if(!context.id){

      for( let index=0 ; index<context.result.data.length ; index++ ){
        let tourId = String(context.result.data[index]._id)
        context.result.data[index].reviewStats = await computeReviewStats( tourId )
      }
    }
    return context
  }

  async function filterByLocation(context) {
    
    let {title} = context.params.query
    
    if(title){
      
      context.params.query.title = {
        $regex: new RegExp(title, 'i')
      }
      
    }

    return context;
  }
}
