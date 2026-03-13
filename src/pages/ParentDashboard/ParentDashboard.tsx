import { useAppSelector } from "../../app/store/hooks";

function ParentDashboard(){
    // console.log("render about")
    const {user} = useAppSelector((state) => state.auth);

    return(
        <>
            ParentDashBoard
            <div>{user?.fullName}</div>
            <div>{user?.gender}</div>
            <div>{user?.address}</div>
            <div>{user?.fullName}</div>
        </>
    )
}

export default ParentDashboard ;