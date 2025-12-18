import router from "./api-routes";
import bonusApi from "../apis/bonus-api";

router.post("/bonus/compute/:employeeId/:year", bonusApi.computeBonus);
