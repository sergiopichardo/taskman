import * as given from "../../steps/given";
import * as when from "../../steps/when";
import * as then from "../../steps/then";

describe("AuthFlow Test", () => {
    it("When User Signs Up, his/her details should be saved in Users Table", async () => {
        const { name, password, email } = given.a_random_user();
        const userSub = await when.a_user_signs_up(name, password, email);
        const ddbUser = await then.user_exists_in_UsersTable(userSub);  // Finally, we make sure that the user exists in the dynamodb table

        expect(ddbUser.UserID).toMatch(userSub);
    })
})