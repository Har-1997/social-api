import { BadRequestException, Injectable } from "@nestjs/common";
import { RangeListDto } from "src/common/dto/RangeList.dto";
import { PaginatedResponse, StatusFriendEnum } from "src/common/interfaces/interfaces";
import { DatabaseService } from "src/modules/database/database.service";
import { FriendUserDto } from "./friends.dto";

@Injectable()
export class FriendsService {
  constructor(
    private readonly db: DatabaseService
  ) {}

  async addFriendServ(requester_id: string, addressee_id: string): Promise<Partial<FriendUserDto>> {
    if (requester_id === addressee_id) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    const result = await this.db.query(
      `INSERT INTO friendships (requester_id, addressee_id)
      VALUES ($1, $2)
      RETURNING id`,
      [requester_id, addressee_id]
    );

    return result.rows[0];
  }

  async listFriendsServ(
    myUuid: string,
    query: RangeListDto
  ): Promise<PaginatedResponse<FriendUserDto>>{
    const { skip = 0, limit = 10 } = query;

    // Query for friendships list with limit
    const listQuery =`
      Select f.id, u.id AS userId, u.first_name, u.last_name
      FROM friendships f
      JOIN users u ON u.id = (
        CASE 
          WHEN f.requester_id = $1 THEN f.addressee_id 
          ELSE f.requester_id 
        END
      )
      WHERE (f.addressee_id = $1 OR f.requester_id = $1) AND f.status = $2
      ORDER BY f.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    // Query for total count
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM friendships
      WHERE (addressee_id = $1 OR requester_id = $1) AND status = $2
    `;

    const [listResult, countResult] = await Promise.all([
      this.db.query(listQuery, [myUuid, StatusFriendEnum.ACCEPT, limit, skip]),
      this.db.query(countQuery, [myUuid, StatusFriendEnum.ACCEPT]),
    ]);

    return {
      items: listResult.rows,
      total: Number(countResult.rows[0].total),
      skip,
      limit,
    };
  }

  async getFriendshipsServ(
    myUuid: string, 
    skip: number,
    limit: number,
    mySending: boolean = true
  ): Promise<PaginatedResponse<FriendUserDto>>{
    let searchUserLike: string = mySending ? 'requester_id' : 'addressee_id';

    const listQuery = `
      SELECT f.id, u.id AS UserId, u.first_name, u.last_name
      FROM friendships f
      JOIN users u ON u.id = f.${searchUserLike}
      WHERE f.${searchUserLike} = $1 AND f.status = $2
      ORDER BY f.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM friendships
      WHERE ${searchUserLike} = $1 AND status = $2
    `;

    const [listResult, countResult] = await Promise.all([
      this.db.query(listQuery, [myUuid, StatusFriendEnum.PENDING, limit, skip]),
      this.db.query(countQuery, [myUuid, StatusFriendEnum.PENDING]),
    ]);

    return {
      items: listResult.rows,
      total: Number(countResult.rows[0].total),
      skip,
      limit,
    };
  }

  async updateFrinedshipServ(
    myUuid: string,
    friendshipId: string,
    status: StatusFriendEnum.ACCEPT | StatusFriendEnum.DECLINED
  ): Promise<{ updated: number }>{
    const result = await this.db.query(
      `UPDATE friendships
      SET status = $1
      WHERE id = $2 AND addressee_id = $3`,
      [status, friendshipId, myUuid],
    );

    return { updated: result.rowCount };
  }

  async deleteFriendServ(
    myUuid: string,
    friendshipId: string
  ): Promise<void>{
    await this.db.query(
      `DELETE FROM friendships
      WHERE (requester_id = $1 AND id = $2)
      OR (addressee_id = $1 AND id = $2)`,
      [myUuid, friendshipId],
    );
  }
}