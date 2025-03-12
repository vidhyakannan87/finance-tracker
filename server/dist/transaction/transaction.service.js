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
const typeorm_2 = require("typeorm");
const transaction_utils_1 = require("./transaction.utils");
const auth_service_1 = require("../auth/auth.service");
let TransactionService = class TransactionService {
    constructor(transactionRepository, authService) {
        this.transactionRepository = transactionRepository;
        this.authService = authService;
    }
    async findAll() {
        const transactions = await this.transactionRepository.find();
        return (0, transaction_utils_1.toTransactionDTOs)(transactions);
    }
    async findOne(id) {
        const transaction = await this.transactionRepository.findOne({
            where: { transactionId: id },
        });
        console.log(transaction);
        return (0, transaction_utils_1.toTransactionDTOs)(transaction);
    }
    async findAllTransactionsByUser(userId) {
        const userTransactions = await this.transactionRepository.find({
            where: { user: { id: userId } },
        });
        return (0, transaction_utils_1.toTransactionDTOs)(userTransactions);
    }
    async create(token, transaction) {
        const newTransaction = this.transactionRepository.create(transaction);
        const user = await this.authService.getUserFromToken(token);
        newTransaction.user = user;
        this.transactionRepository.save(newTransaction);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map