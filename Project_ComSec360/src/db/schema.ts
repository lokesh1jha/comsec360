import { pgTable, pgEnum, serial, text, uuid, varchar } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum('type', ['admin', 'account_user', 'guest']);

export const Users_Table = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("firstName", {length: 255}).notNull(),
    lastName: varchar("lastName", {length: 255}).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    type: userTypeEnum('type').notNull().default('guest'),
    email: varchar("email", {length: 320}).notNull()

});