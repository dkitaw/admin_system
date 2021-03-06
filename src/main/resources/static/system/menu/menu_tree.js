$(function () {
    // 加载菜单树
    $.ajax({
        type : "POST",
        url : "/api/menu/getAllMenus",
        success : function(data) {
            var menus = packageMenus(data);
            $("#jsTree").jstree({
                core : {
                    data : menus
                },
                plugins : ["checkbox"]
            }).on("ready.jstree", function () {
                var roleId = $("#id").val();
                getMenusByRoleId(roleId);
            });
        }
    });

    // 封装菜单信息
    function packageMenus(data) {
        var menus = new Array();
        $.each(data, function(i, obj) {
            var node = {};
            node.id = obj.id;
            node.parent = obj.parentId == '' ? '#' : obj.parentId;
            node.text = obj.menuName;
            node.icon = obj.icon;
            node.state = {'opened': true };
            menus[i] = node;
        });
        return menus;
    }

    // 根据角色Id获取对应的菜单
    function getMenusByRoleId(roleId) {
        $.ajax({
            type : "get",
            url : "/api/menu/getMenusByRoleId/" + roleId,
            success : function(data) {
                $.each(data, function(i, obj) {
                    if (!$("#jsTree").jstree(true).is_parent(obj.id)) {
                        $("#jsTree").jstree(true).check_node(obj.id);
                    }
                });
            }
        });
    }

    // 获取选中以及半选中状态下CheckBox的id值
    function getCheckboxTreeSelNode(treeid){
        var ids = Array();
        $("#"+treeid).find("li").each(function(){
            var liid = $(this).attr("id");
            if($("#"+liid+">a").hasClass("jstree-clicked") || $("#"+liid+">a>i").hasClass("jstree-undetermined")){
                ids.push(liid);
            }
        });
        return ids;
    }

    // 保存或编辑菜单树操作
    $(document).delegate("#btn_add", 'click',function () {
        alert(getCheckboxTreeSelNode("jsTree"));
        $.ajax({
            type : "GET",
            url : "/api/role/123",
            data:{
                "menuIds": getCheckboxTreeSelNode("jsTree")
            },
            success: function(data){
                if (data.code == 0) {
                    layer.msg("添加成功", {icon: 1, time: 2000});
                } else {
                    layer.msg("添加失败", {icon: 2, time: 2000});
                }
            },
            error:function(data){
                layer.msg("请求异常", {icon: 5, time: 1500});
            }

        });
    });
});