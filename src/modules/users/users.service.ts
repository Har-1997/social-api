import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/database.service";
import {
  GetUsersDto,
  UpdateUsersDto,
  UserResponseDto
} from "./users.dto";
import { PaginatedResponse } from "src/common/interfaces/interfaces";

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService
  ) {}

  async createUserServ(
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    password: string
  ): Promise<UserResponseDto>{
    const result = await this.db.query(
      `INSERT INTO users (first_name, last_name, age, email, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email`,
      [firstName, lastName, age, email, password]
    );

    return result.rows[0];
  }

  async getUsersServ(
    uuid: string,
    query: GetUsersDto
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const { first_name, last_name, age, skip = 0, limit = 10 } = query;
  
    const filters: string[] = [];
    const values: any[] = [];
  
    // Exclude current user from search
    filters.push(`id != $${values.length + 1}`);
    values.push(uuid);
  
    if (first_name) {
      filters.push(`first_name ILIKE $${values.length + 1}`);
      values.push(first_name);
    }
  
    if (last_name) {
      filters.push(`last_name ILIKE $${values.length + 1}`);
      values.push(last_name);
    }
  
    if (age) {
      filters.push(`age = $${values.length + 1}`);
      values.push(age);
    }
  
    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  
    // Query for data with limit
    const listQuery = `
      SELECT id, first_name, last_name, age, email
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
  
    values.push(limit, skip);
  
    // Query for Total count
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM users
      ${whereClause}
    `;
  
    const [listResult, countResult] = await Promise.all([
      this.db.query<UserResponseDto>(listQuery, values),
      this.db.query<{ total: string }>(countQuery, values.slice(0, values.length - 2)),
    ]);
  
    return {
      items: listResult.rows,
      total: Number(countResult.rows[0].total),
      skip,
      limit,
    };
  }

  async getUserWithEmailServ(email: string){
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0];
  }

  async getUserServ(uuid: string){
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [uuid]
    );

    return result.rows[0];
  }

  async updateMeServ(uuid: string, data: UpdateUsersDto): Promise<void | object>{
    const updates: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if(value !== undefined){
        updates.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return { message: 'No fields provided for update' };
    }

    values.push(uuid);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}`;
    await this.db.query(query, values);
  }

  async deleteMeServ(uuid: string){
    const result = await this.db.query(
      'DELETE FROM users WHERE id = $1',
      [uuid]
    );
  }
}