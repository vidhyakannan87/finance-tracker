"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_entity_1 = require("../data_access/entities/transaction.entity");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
let TransactionService = class TransactionService {
    constructor(transactionRepository, userService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }
    findAll() {
        return this.transactionRepository.find();
    }
    findOne(id) {
        return this.transactionRepository.findOne({ where: { transactionId: id } });
    }
    findAllTransactionsByUser(userId) {
        return this.transactionRepository.find({ where: { user: { id: userId } } });
    }
    async create(transaction) {
        const newTransaction = this.transactionRepository.create(transaction);
        const user = await this.userService.findOne(transaction.user.id);
        newTransaction.user = user;
        return this.transactionRepository.save(newTransaction);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map