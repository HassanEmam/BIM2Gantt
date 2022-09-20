import { Vector3 } from "three";

export function initializeOutline(max, min) {
    return {
        v1: new Vector3(min.x, min.y, max.z),
        v2: new Vector3(max.x, min.y, max.z),
        v3: new Vector3(min.x, max.y, max.z),
        v4: new Vector3(max.x, max.y, max.z),
        v5: new Vector3(min.x, min.y, min.z),
        v6: new Vector3(max.x, min.y, min.z),
        v7: new Vector3(min.x, max.y, min.z),
        v8: new Vector3(max.x, max.y, min.z),
    };
}
export function initializePlaneMesh(max, min, type) {
    var v1, v2, v3, v4, dis, constant, normal, rotation;

    switch (type) {
        case 1: //left
            dis = max.z;
            v1 = new Vector3(min.x, min.y, dis);
            v2 = new Vector3(max.x, min.y, dis);
            v3 = new Vector3(min.x, max.y, dis);
            v4 = new Vector3(max.x, max.y, dis);
            normal = new Vector3(0, 0, -1);
            constant = dis;
            rotation = (control) => {
                control.rotateX(Math.PI / 2);
            };
            break;
        case 2: //right
            dis = min.z;
            v1 = new Vector3(min.x, min.y, dis);
            v2 = new Vector3(max.x, min.y, dis);
            v3 = new Vector3(min.x, max.y, dis);
            v4 = new Vector3(max.x, max.y, dis);
            normal = new Vector3(0, 0, 1);
            constant = -dis;
            rotation = (control) => {
                control.rotateX(-Math.PI / 2);
            };
            break;
        case 3: //front
            dis = max.x;
            v1 = new Vector3(dis, min.y, max.z);
            v2 = new Vector3(dis, min.y, min.z);
            v3 = new Vector3(dis, max.y, max.z);
            v4 = new Vector3(dis, max.y, min.z);
            normal = new Vector3(-1, 0, 0);
            constant = dis;
            rotation = (control) => {
                control.rotateZ(-Math.PI / 2);
            };
            break;
        case 4: //back
            dis = min.x;
            v1 = new Vector3(dis, min.y, max.z);
            v2 = new Vector3(dis, min.y, min.z);
            v3 = new Vector3(dis, max.y, max.z);
            v4 = new Vector3(dis, max.y, min.z);
            normal = new Vector3(1, 0, 0);
            constant = -dis;
            rotation = (control) => {
                control.rotateZ(Math.PI / 2);
            };
            break;
        case 5: //top
            dis = max.y;
            v1 = new Vector3(max.x, dis, max.z);
            v2 = new Vector3(max.x, dis, min.z);
            v3 = new Vector3(min.x, dis, max.z);
            v4 = new Vector3(min.x, dis, min.z);
            normal = new Vector3(0, -1, 0);
            constant = dis;
            rotation = (control) => {
                return;
            };
            break;
        case 6: //bottom
            dis = min.y;
            v1 = new Vector3(max.x, dis, max.z);
            v2 = new Vector3(max.x, dis, min.z);
            v3 = new Vector3(min.x, dis, max.z);
            v4 = new Vector3(min.x, dis, min.z);
            normal = new Vector3(0, 1, 0);
            constant = -dis;
            rotation = (control) => {
                control.rotateZ(Math.PI);
            };
            break;
        default:
            break;
    }
    return {
        v1: v1,
        v2: v2,
        v3: v3,
        v4: v4,
        dis: dis,
        normal: normal,
        constant: constant,
        rotation: rotation,
    };
}
export function createPlaneVertices() {
    return new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

export function createLineVertices() {
    return new Float32Array([0, 0, 0, 0, 0, 0]);
}
export function updateLineVertices(vertices, v1, v2, line) {
    vertices[0] = v1.x;
    vertices[1] = v1.y;
    vertices[2] = v1.z;
    vertices[3] = v2.x;
    vertices[4] = v2.y;
    vertices[5] = v2.z;
    line.geometry.attributes.position.needsUpdate = true;
}

export function updatePlanVertices(vertices, v1, v2, v3, v4, plan) {
    vertices[0] = v1.x;
    vertices[1] = v1.y;
    vertices[2] = v1.z;
    vertices[3] = v2.x;
    vertices[4] = v2.y;
    vertices[5] = v2.z;
    vertices[6] = v3.x;
    vertices[7] = v3.y;
    vertices[8] = v3.z;
    vertices[9] = v3.x;
    vertices[10] = v3.y;
    vertices[11] = v3.z;
    vertices[12] = v2.x;
    vertices[13] = v2.y;
    vertices[14] = v2.z;
    vertices[15] = v4.x;
    vertices[16] = v4.y;
    vertices[17] = v4.z;
    plan.geometry.attributes.position.needsUpdate = true;
}

function updateVerticesLeftRight(left, right, front, back, top, bottom, outLines, isLeft) {
    var positionZ = isLeft ? left.control.group.position.z : right.control.group.position.z;
    var s1, s2, s3, t1, t2, t3, t4;
    if (isLeft) {
        left.vertices[2] = positionZ;
        left.vertices[5] = positionZ;
        left.vertices[8] = positionZ;
        left.vertices[11] = positionZ;
        left.vertices[14] = positionZ;
        left.vertices[17] = positionZ;
        left.planeMesh.geometry.attributes.position.needsUpdate = true;
        left.plane.constant = positionZ;
        s1 = 2;
        s2 = 8;
        s3 = 11;
        t1 = 0;
        t2 = 1;
        t3 = 2;
        t4 = 3;
    } else {
        right.vertices[2] = positionZ;
        right.vertices[5] = positionZ;
        right.vertices[8] = positionZ;
        right.vertices[11] = positionZ;
        right.vertices[14] = positionZ;
        right.vertices[17] = positionZ;
        right.planeMesh.geometry.attributes.position.needsUpdate = true;
        right.plane.constant = -positionZ;
        s1 = 5;
        s2 = 14;
        s3 = 17;
        t1 = 8;
        t2 = 9;
        t3 = 10;
        t4 = 11;
    }

    front.vertices[s1] = positionZ;
    front.vertices[s2] = positionZ;
    front.vertices[s3] = positionZ;
    front.planeMesh.geometry.attributes.position.needsUpdate = true;
    var frontCenter = front.computeCenterVertices();
    front.control.group.position.set(frontCenter.x, frontCenter.y, frontCenter.z);

    back.vertices[s1] = positionZ;
    back.vertices[s2] = positionZ;
    back.vertices[s3] = positionZ;
    back.planeMesh.geometry.attributes.position.needsUpdate = true;
    var backCenter = back.computeCenterVertices();
    back.control.group.position.set(backCenter.x, backCenter.y, backCenter.z);

    top.vertices[s1] = positionZ;
    top.vertices[s2] = positionZ;
    top.vertices[s3] = positionZ;
    top.planeMesh.geometry.attributes.position.needsUpdate = true;
    var topCenter = top.computeCenterVertices();
    top.control.group.position.set(topCenter.x, topCenter.y, topCenter.z);

    bottom.vertices[s1] = positionZ;
    bottom.vertices[s2] = positionZ;
    bottom.vertices[s3] = positionZ;
    bottom.planeMesh.geometry.attributes.position.needsUpdate = true;
    var bottomCenter = bottom.computeCenterVertices();
    bottom.control.group.position.set(bottomCenter.x, bottomCenter.y, bottomCenter.z);

    outLines.forEach((outline) => {
        if (outline.type === t1 || outline.type === t2 || outline.type === t3 || outline.type === t4) {
            outline.vertices[2] = positionZ;
            outline.vertices[5] = positionZ;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
        if (outline.type === 4 || outline.type === 5 || outline.type === 6 || outline.type === 7) {
            outline.vertices[isLeft ? 2 : 5] = positionZ;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
    });
}

function updateVerticesFrontBack(left, right, front, back, top, bottom, outLines, isFront) {
    var positionX = isFront ? front.control.group.position.x : back.control.group.position.x;
    var s1, s2, s3, s1a, s2a, s3a, t1, t2, t3, t4;
    if (isFront) {
        front.vertices[0] = positionX;
        front.vertices[3] = positionX;
        front.vertices[6] = positionX;
        front.vertices[9] = positionX;
        front.vertices[12] = positionX;
        front.vertices[15] = positionX;
        front.planeMesh.geometry.attributes.position.needsUpdate = true;
        front.plane.constant = positionX;
        s1 = 3;
        s2 = 12;
        s3 = 15;
        s1a = 0;
        s2a = 3;
        s3a = 12;
        t1 = 1;
        t2 = 5;
        t3 = 6;
        t4 = 9;
    } else {
        back.vertices[0] = positionX;
        back.vertices[3] = positionX;
        back.vertices[6] = positionX;
        back.vertices[9] = positionX;
        back.vertices[12] = positionX;
        back.vertices[15] = positionX;
        back.planeMesh.geometry.attributes.position.needsUpdate = true;
        back.plane.constant = -positionX;
        s1 = 0;
        s2 = 6;
        s3 = 9;
        s1a = 6;
        s2a = 9;
        s3a = 15;
        t1 = 3;
        t2 = 4;
        t3 = 7;
        t4 = 11;
    }

    left.vertices[s1] = positionX;
    left.vertices[s2] = positionX;
    left.vertices[s3] = positionX;
    left.planeMesh.geometry.attributes.position.needsUpdate = true;
    var leftCenter = left.computeCenterVertices();
    left.control.group.position.set(leftCenter.x, leftCenter.y, leftCenter.z);

    right.vertices[s1] = positionX;
    right.vertices[s2] = positionX;
    right.vertices[s3] = positionX;
    right.planeMesh.geometry.attributes.position.needsUpdate = true;
    var rightCenter = right.computeCenterVertices();
    right.control.group.position.set(rightCenter.x, rightCenter.y, rightCenter.z);

    top.vertices[s1a] = positionX;
    top.vertices[s2a] = positionX;
    top.vertices[s3a] = positionX;
    top.planeMesh.geometry.attributes.position.needsUpdate = true;
    var topCenter = top.computeCenterVertices();
    top.control.group.position.set(topCenter.x, topCenter.y, topCenter.z);

    bottom.vertices[s1a] = positionX;
    bottom.vertices[s2a] = positionX;
    bottom.vertices[s3a] = positionX;
    bottom.planeMesh.geometry.attributes.position.needsUpdate = true;
    var bottomCenter = bottom.computeCenterVertices();
    bottom.control.group.position.set(bottomCenter.x, bottomCenter.y, bottomCenter.z);

    outLines.forEach((outline) => {
        if (outline.type === t1 || outline.type === t2 || outline.type === t3 || outline.type === t4) {
            outline.vertices[0] = positionX;
            outline.vertices[3] = positionX;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
        if (outline.type === 0 || outline.type === 8) {
            outline.vertices[isFront ? 3 : 0] = positionX;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
        if (outline.type === 2 || outline.type === 10) {
            outline.vertices[isFront ? 0 : 3] = positionX;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
    });
}

function updateVerticesTopBottom(left, right, front, back, top, bottom, outLines, isTop) {
    var positionY = isTop ? top.control.group.position.y : bottom.control.group.position.y;
    var s1, s2, s3, t1, t2, t3, t4;
    if (isTop) {
        top.vertices[1] = positionY;
        top.vertices[4] = positionY;
        top.vertices[7] = positionY;
        top.vertices[10] = positionY;
        top.vertices[13] = positionY;
        top.vertices[16] = positionY;
        top.planeMesh.geometry.attributes.position.needsUpdate = true;
        top.plane.constant = positionY;
        s1 = 7;
        s2 = 10;
        s3 = 16;
        t1 = 2;
        t2 = 6;
        t3 = 7;
        t4 = 10;
    } else {
        bottom.vertices[1] = positionY;
        bottom.vertices[4] = positionY;
        bottom.vertices[7] = positionY;
        bottom.vertices[10] = positionY;
        bottom.vertices[13] = positionY;
        bottom.vertices[16] = positionY;
        bottom.planeMesh.geometry.attributes.position.needsUpdate = true;
        bottom.plane.constant = -positionY;
        s1 = 1;
        s2 = 4;
        s3 = 13;
        t1 = 0;
        t2 = 4;
        t3 = 5;
        t4 = 8;
    }

    left.vertices[s1] = positionY;
    left.vertices[s2] = positionY;
    left.vertices[s3] = positionY;
    left.planeMesh.geometry.attributes.position.needsUpdate = true;
    var leftCenter = left.computeCenterVertices();
    left.control.group.position.set(leftCenter.x, leftCenter.y, leftCenter.z);

    right.vertices[s1] = positionY;
    right.vertices[s2] = positionY;
    right.vertices[s3] = positionY;
    right.planeMesh.geometry.attributes.position.needsUpdate = true;
    var rightCenter = right.computeCenterVertices();
    right.control.group.position.set(rightCenter.x, rightCenter.y, rightCenter.z);

    front.vertices[s1] = positionY;
    front.vertices[s2] = positionY;
    front.vertices[s3] = positionY;
    front.planeMesh.geometry.attributes.position.needsUpdate = true;
    var frontCenter = front.computeCenterVertices();
    front.control.group.position.set(frontCenter.x, frontCenter.y, frontCenter.z);

    back.vertices[s1] = positionY;
    back.vertices[s2] = positionY;
    back.vertices[s3] = positionY;
    back.planeMesh.geometry.attributes.position.needsUpdate = true;
    var backCenter = back.computeCenterVertices();
    back.control.group.position.set(backCenter.x, backCenter.y, backCenter.z);

    outLines.forEach((outline) => {
        if (outline.type === t1 || outline.type === t2 || outline.type === t3 || outline.type === t4) {
            outline.vertices[1] = positionY;
            outline.vertices[4] = positionY;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
        if (outline.type === 1 || outline.type === 9) {
            outline.vertices[isTop ? 4 : 1] = positionY;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
        if (outline.type === 3 || outline.type === 11) {
            outline.vertices[isTop ? 1 : 4] = positionY;
            outline.line.geometry.attributes.position.needsUpdate = true;
        }
    });
}

export function transformLeft(planeModels) {
    planeModels.left.control.group.userData.actionTransFormControl = () => {
        updateVerticesLeftRight(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            true
        );
    };
}

export function transformRight(planeModels) {
    planeModels.right.control.group.userData.actionTransFormControl = () => {
        updateVerticesLeftRight(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            false
        );
    };
}
export function transformFront(planeModels) {
    planeModels.front.control.group.userData.actionTransFormControl = () => {
        updateVerticesFrontBack(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            true
        );
    };
}
export function transformBack(planeModels) {
    planeModels.back.control.group.userData.actionTransFormControl = () => {
        updateVerticesFrontBack(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            false
        );
    };
}
export function transformTop(planeModels) {
    planeModels.top.control.group.userData.actionTransFormControl = () => {
        updateVerticesTopBottom(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            true
        );
    };
}
export function transformBottom(planeModels) {
    planeModels.bottom.control.group.userData.actionTransFormControl = () => {
        updateVerticesTopBottom(
            planeModels.left,
            planeModels.right,
            planeModels.front,
            planeModels.back,
            planeModels.top,
            planeModels.bottom,
            planeModels.outLines,
            false
        );
    };
}