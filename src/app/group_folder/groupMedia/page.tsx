
import GroupPostReel from "@/components/Group/GroupPostReel";

interface GroupMediaProps {
    groupId: string
}


const GroupMedia = ({ groupId }: GroupMediaProps) => {
        
        
    return(
        <div className=" w-full absolute top-2 left-4 ">
        <GroupPostReel groupId={groupId} />
      </div>
     
    );
}
export default GroupMedia;