import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // the users who have subscribed to the channel
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // the channels to whom users have subscribed
        ref: "User"
    }
}, {timestamps: true})


// SUBSCRIBER - SUBS
// CHANNEL- CH
//USer -> a, b, c
//Channel -> Ch1, Ch2, Ch3
// |-----------------| |-----------------| |-----------------| |-----------------| 
// | CH     |  CH1   | | CH     |  CH1   | | CH     |  CH2   | | CH     |  CH3   |
// |-----------------| |-----------------| |-----------------| |-----------------|
// | SUBS   |  a     | | SUBS   |  b     | | SUBS   |  c     | | SUBS   |  d     |
// |-----------------| |-----------------| |-----------------| |-----------------|

// in mongoDb the documents would be created in above format, each time someone subscribes to a channel, a new document will be created in the subscription collection.
// If we have to count how many users have subscribed to a channel, we filter with channel.
// If we have to found how many channels a user has subscribed to, we filter with subscriber.

export const Subscription = mongoose.model("Subscription", subscriptionSchema)