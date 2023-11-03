function NodeFactory(data, left, right) {
  return { data, left, right };
}

function removeDuplicatesFromSortedArray(array) {
  let duplicateIndexStack = [];

  for (const index in array) {
    if (index && array[index] === array[index - 1]) {
      duplicateIndexStack.push(index);
    }
  }

  for (const index of duplicateIndexStack.reverse()) {
    array.splice(index, 1);
  }
}
function sortAndRemoveDuplicates(array) {
  array.sort((left, right) => left - right);

  removeDuplicatesFromSortedArray(array);
}

function buildTree(array) {
  if (array.length === 0) {
    return null;
  } else if (array.length === 1) {
    return NodeFactory(array[0], null, null);
  }

  sortAndRemoveDuplicates(array);
  const middle = Math.floor(array.length / 2);
  return NodeFactory(
    array[middle],
    recursiveBuildTree(array.slice(0, middle)),
    recursiveBuildTree(array.slice(middle + 1)),
  );
}

function recursiveBuildTree(array) {
  if (array.length === 0) {
    return null;
  } else if (array.length === 1) {
    return NodeFactory(array[0], null, null);
  }
  const middle = Math.floor(array.length / 2);
  return NodeFactory(
    array[middle],
    recursiveBuildTree(array.slice(0, middle)),
    recursiveBuildTree(array.slice(middle + 1)),
  );
}
function TreeFactory(array) {
  return {
    root: buildTree(array),
    prettyPrint: function (node, prefix = "", isLeft = true) {
      if (!node) {
        return;
      }

      if (node.right) {
        this.prettyPrint(
          node.right,
          `${prefix}${isLeft ? "│   " : "    "}`,
          false,
        );
      }

      console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

      if (node.left) {
        this.prettyPrint(
          node.left,
          `${prefix}${isLeft ? "    " : "│   "}`,
          true,
        );
      }
    },
    insert: function (value) {
      const recursiveInsert = (node) => {
        if (!node) {
          return NodeFactory(value);
        }

        if (node.data < value) {
          node.right = recursiveInsert(node.right);
        } else if (node.data > value) {
          node.left = recursiveInsert(node.left);
        }

        return node;
      };

      this.root = recursiveInsert(this.root);
    },
    delete: function (value) {
      const recursiveDelete = (node) => {
        if (!node) {
          return null;
        }

        if (node.data === value) {
          if (!node.left && !node.right) {
            return null;
          } else if (!node.left && node.right) {
            return node.right;
          } else if (node.left && !node.right) {
            return node.left;
          } else {
            let previous = null;
            let inOrderSuccesor = node.right;

            while (inOrderSuccesor.left) {
              previous = inOrderSuccesor;
              inOrderSuccesor = inOrderSuccesor.left;
            }

            if (previous) {
              previous.left = inOrderSuccesor.right;
            } else {
              node.right = inOrderSuccesor.right;
            }

            node.data = inOrderSuccesor.data;
          }
        } else if (node.data < value && node.right) {
          node.right = recursiveDelete(node.right);
        } else if (node.data > value && node.left) {
          node.left = recursiveDelete(node.left);
        }

        return node;
      };

      this.root = recursiveDelete(this.root);
    },
    find: function (value) {
      const recursiveFind = (node) => {
        if (!node) {
          return null;
        }

        if (node.data === value) {
          return node;
        } else if (node.data < value) {
          return recursiveFind(node.right);
        } else {
          return recursiveFind(node.left);
        }
      };

      return recursiveFind(this.root);
    },
    levelOrder: function (callback) {
      const levelOrderArray = [];
      const queue = [];
      queue.push(this.root);

      while (queue.length > 0) {
        const current = queue.shift();

        if (callback) {
          callback(current);
        } else {
          levelOrderArray.push(current.data);
        }

        if (current.left) {
          queue.push(current.left);
        }

        if (current.right) {
          queue.push(current.right);
        }
      }

      return levelOrderArray;
    },
    inOrder: function (callback) {
      const inOrderArray = [];

      const recursiveInOrder = (node) => {
        if (!node) {
          return;
        }

        recursiveInOrder(node.left);
        if (callback) {
          callback(node);
        } else {
          inOrderArray.push(node.data);
        }
        recursiveInOrder(node.right);
      };

      recursiveInOrder(this.root);

      return inOrderArray;
    },
    preOrder: function (callback) {
      const preOrderArray = [];

      const recursivePreOrder = (node) => {
        if (!node) {
          return;
        }

        if (callback) {
          callback(node);
        } else {
          preOrderArray.push(node.data);
        }
        recursivePreOrder(node.left);
        recursivePreOrder(node.right);
      };

      recursivePreOrder(this.root);

      return preOrderArray;
    },
    postOrder: function (callback) {
      const postOrderArray = [];

      const recursivePostOrder = (node) => {
        if (!node) {
          return;
        }

        recursivePostOrder(node.left);
        recursivePostOrder(node.right);
        if (callback) {
          callback(node);
        } else {
          postOrderArray.push(node.data);
        }
      };

      recursivePostOrder(this.root);

      return postOrderArray;
    },
    height: function (node) {
      if (!node) {
        return 0;
      }

      const foundNode = this.find(node.data);
      const recursiveHeight = (node) => {
        if (!node) {
          return -1;
        }

        return Math.max(
          recursiveHeight(node.left) + 1,
          recursiveHeight(node.right) + 1,
        );
      };

      if (foundNode) {
        return Math.max(
          recursiveHeight(foundNode.left) + 1,
          recursiveHeight(foundNode.right) + 1,
        );
      } else {
        return 0;
      }
    },
    depth: function (node) {
      if (!node) {
        return 0;
      }

      let foundNode = this.find(node.data);

      if (foundNode) {
        foundNode = this.root;
        let nodeDepth = 0;

        while (foundNode.data !== value) {
          if (foundNode.data > value) {
            foundNode = foundNode.left;
          } else {
            foundNode = foundNode.right;
          }

          nodeDepth++;
        }

        return nodeDepth;
      } else {
        return 0;
      }
    },
    isBalanced: function () {
      const recursiveIsBalanced = (node) => {
        if (!node) {
          return true;
        }

        if (Math.abs(this.height(node.left) - this.height(node.right)) > 1) {
          return false;
        }

        return (
          recursiveIsBalanced(node.left) && recursiveIsBalanced(node.right)
        );
      };

      return recursiveIsBalanced(this.root);
    },
    rebalance: function () {
      this.root = buildTree(this.inOrder());
    },
  };
}

(function driver() {
  const array = [];
  for (let i = 0; i < 10; i++) {
    array.push(Math.ceil(Math.random() * 100));
  }
  sortAndRemoveDuplicates(array);

  const tree = TreeFactory(array);
  console.log(`Tree is balanced: ${tree.isBalanced()}`);
  console.log(`Level Order Traversal: ${tree.levelOrder()}`);
  console.log(`Pre Order Traversal: ${tree.preOrder()}`);
  console.log(`In Order Traversal: ${tree.inOrder()}`);
  console.log(`Post Order Traversal: ${tree.postOrder()}`);
  console.log("Unbalancing tree...");
  tree.insert(101);
  tree.insert(102);
  tree.insert(103);
  console.log(`Tree is balanced: ${tree.isBalanced()}`);
  console.log("Rebalancing tree...");
  tree.rebalance();
  console.log(`Tree is balanced: ${tree.isBalanced()}`);
  console.log(`Level Order Traversal: ${tree.levelOrder()}`);
  console.log(`Pre Order Traversal: ${tree.preOrder()}`);
  console.log(`In Order Traversal: ${tree.inOrder()}`);
  console.log(`Post Order Traversal: ${tree.postOrder()}`);
})();
