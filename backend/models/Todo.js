import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    description: { type: String, required: true, minlength: 1, maxlength: 500 },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

todoSchema.methods.updateDescription = async function (newDescription) {
    this.description = newDescription;
    this.updatedDate = Date.now();
    await this.save();
  };
  
todoSchema.pre('save', function(next) {
    if (this.isModified('status') || this.isModified('description')) {
        this.updatedDate = Date.now();  // Automatically update the updatedDate field
    }
    next();
});

todoSchema.methods.updateStatus = async function (newStatus) {
    if (['pending', 'completed'].includes(newStatus)) {
        this.status = newStatus;
        await this.save();
    } else {
        throw new Error('Invalid status value');
    }
};

export default mongoose.model('Todo', todoSchema);
